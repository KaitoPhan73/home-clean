import { CheckCircle, Clock, XCircle } from "lucide-react";

export const statusIcons = {
    active: <CheckCircle className="text-green-500" size={20} />,
    inactive: <XCircle className="text-red-500" size={20} />,
    pending: <Clock className="text-yellow-500" size={20} />,
  };