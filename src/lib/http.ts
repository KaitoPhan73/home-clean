/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { redirect } from "next/navigation";
import NextFetchRequestConfig from "next/types";
import envConfig from "@/schema/config";
import { normalizePath } from "./utils";
import { TAuthResponse } from "@/schema/auth.schema";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface CustomOptions
  extends Omit<RequestInit, "method">,
  NextFetchRequestConfig {
  baseUrl?: string;
  params?: Record<string, string>;
}

export interface HttpResponse<T> {
  status: number;
  payload: T;
}

interface HttpErrorPayload {
  message: string;
  [key: string]: any;
}

class HttpError extends Error {
  constructor(public status: number, public payload: HttpErrorPayload) {
    super(payload.message);
    this.name = "HttpError";
  }
}

class EntityError extends HttpError {
  constructor(public errors: { field: string; message: string }[]) {
    super(422, { message: "Validation Error", errors });
    this.name = "EntityError";
  }
}

const buildQueryString = (params: Record<string, any>): string =>
  Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

export const isClient = () => typeof window !== "undefined";

const createHttpClient = (defaultBaseUrl: string) => {
  let clientLogoutRequest: Promise<any> | null = null;

  const request = async <T>(
    method: HttpMethod,
    url: string,
    options?: CustomOptions
  ): Promise<HttpResponse<T>> => {
    const baseUrl =
      options?.baseUrl === undefined ? defaultBaseUrl : options.baseUrl;

    let fullUrl = url.startsWith("/")
      ? `${baseUrl}${url}`
      : `${baseUrl}/${url}`;
    console.log("options", options);
    if (options?.params) {
      const queryString = buildQueryString(options.params);
      fullUrl = queryString ? `${fullUrl}?${queryString}` : `${fullUrl}`;
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...Object.fromEntries(
        Object.entries(options?.headers || {}).filter(
          ([key, value]) => typeof value === "string"
        )
      ),
    };

    if (isClient()) {
      const token = localStorage.getItem("accessToken");
      console.log("Token được sử dụng:", token); // Log token
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }


    const config: RequestInit & NextFetchRequestConfig = {
      ...options,
      method,
      headers,
      body:
        options?.body instanceof FormData
          ? options.body
          : JSON.stringify(options?.body),
      next: options?.next,
    };
    console.log("config", config);
    try {
      const response = await fetch(fullUrl, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized(headers);
        } else if (response.status === 422) {
          throw new EntityError(data.errors);
        } else {
          if (response.status !== 500) {
            throw new Error(JSON.stringify(data));
          } else {
            throw new HttpError(response.status, data);
          }
        }
      }

      handleAuthResponse(url, data);
      return { status: response.status, payload: data };
    } catch (error) {
      console.error(`Error in ${method} request to ${fullUrl}:`, error);
      throw error;
    }
  };

  const handleUnauthorized = async (headers: Record<string, string>) => {
    if (isClient()) {
      if (!clientLogoutRequest) {
        clientLogoutRequest = fetch("/api/auth/logout", {
          method: "POST",
          body: JSON.stringify({ force: true }),
          headers,
        });
        try {
          await clientLogoutRequest;
        } finally {
          localStorage.removeItem("accessToken");
          clientLogoutRequest = null;
          window.location.href = "/login";
        }
      }
    } else {
      const token = (headers["Authorization"] as string)?.split("Bearer ")[1];
      redirect(`/logout?accessToken=${token}`);
    }
  };

  const handleAuthResponse = (url: string, data: any) => {
    if (isClient()) {

      if (
        ["api/auth", "/register"].some((item) => item === normalizePath(url))
      ) {
        const parseData = data.user;

        localStorage.setItem("accessToken", data.accessToken);
        // console.log("parseData", data);
        localStorage.setItem("user", JSON.stringify(parseData));
      } else if (url === "/auth/logout") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }
  };

  return {
    get: <T>(url: string, options?: Omit<CustomOptions, "body">) =>
      request<T>("GET", url, options),
    post: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) =>
      request<T>("POST", url, { ...options, body }),
    put: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) =>
      request<T>("PUT", url, { ...options, body }),
    patch: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) =>
      request<T>("PATCH", url, { ...options, body }),
    delete: <T>(url: string, options?: Omit<CustomOptions, "body">) =>
      request<T>("DELETE", url, options),
  };
};

const httpLocal = createHttpClient(envConfig.NEXT_PUBLIC_URL);
const httpBag = createHttpClient(envConfig.NEXT_PUBLIC_BAG_API_ENDPOINT);
const httpMock = createHttpClient(envConfig.NEXT_PUBLIC_MOCK_API_ENDPOINT);
const httpHomePlus = createHttpClient(
  envConfig.NEXT_PUBLIC_HOMEPLUS_API_ENDPOINT
);
const httpVinWallet = createHttpClient(
  envConfig.NEXT_PUBLIC_VINWALLET_API_ENDPOINT
);

export {
  httpLocal,
  httpBag,
  httpMock,
  httpHomePlus,
  httpVinWallet,
  HttpError,
  EntityError,
};
