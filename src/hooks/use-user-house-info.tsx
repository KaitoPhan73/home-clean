/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { getBuildingById } from "@/apis/building";
import { getHouseById } from "@/apis/house";
import { getUserById } from "@/apis/vinwallet/user";
import { TBuildingResponse } from "@/schema/building.schema";
import { THouseResponse } from "@/schema/house.schema";
import { TUserResponse } from "@/schema/user.schema";
import { useEffect, useState } from "react";
type Props = {
  userId: string;
};

export const useUserHouseInfo = ({ userId }: Props) => {
  const [user, setUser] = useState<TUserResponse | null>(null);
  const [house, setHouse] = useState<THouseResponse | null>(null);
  const [building, setBuilding] = useState<TBuildingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await getUserById(userId);
        setUser(resUser.payload);

        if (resUser.payload.houseId) {
          const resHouse = await getHouseById(resUser.payload.houseId);
          setHouse(resHouse.payload);

          const resBuilding = await getBuildingById(
            resHouse.payload.buildingId
          );
          setBuilding(resBuilding.payload);
        } else {
          setHouse(null);
          setBuilding(null);
        }
      } catch (err: any) {
        console.error("Lỗi khi lấy thông tin người dùng/nhà/toà:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { user, house, building, loading, error };
};
