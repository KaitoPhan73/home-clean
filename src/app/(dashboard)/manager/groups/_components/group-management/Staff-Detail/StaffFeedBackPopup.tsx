/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Star, 
  Clock, 
  MessageCircle, 
  File, 
  BarChart2, 
  AlertTriangle, 
  Award,
  ThumbsUp,
  Calendar,
  Filter,
  ChevronRight
} from "lucide-react";
import { getFeedBackByStaffId } from "@/apis/staff";
import { TFeedbackResponse } from "@/schema/feedback.schema";

interface StaffFeedBackPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string;
  staffName: string;
}

const StaffFeedBackPopup: React.FC<StaffFeedBackPopupProps> = ({ isOpen, onOpenChange, staffId, staffName }) => {
  const [feedbackData, setFeedbackData] = useState<TFeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<{ [key: number]: number }>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
      setSelectedTab("all");
      document.body.style.overflow = "hidden";
      if (staffId) {
        fetchFeedbackData();
      } else {
        setError("Không có staffId được cung cấp");
        setLoading(false);
      }
    } else {
      setAnimateIn(false);
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, staffId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);
    //   console.log("Fetching feedback for staffId:", staffId);
      const response = await getFeedBackByStaffId(staffId);
    //   console.log("API response:", response);
      const feedbackItems: TFeedbackResponse[] = Array.isArray(response?.payload?.items) 
        ? response.payload.items 
        : Array.isArray(response?.payload.items) 
          ? response.payload.items 
          : [];
    //   console.log("Feedback items:", feedbackItems);
      setFeedbackData(feedbackItems);
      
      if (feedbackItems.length > 0) {
        const totalRating = feedbackItems.reduce((sum, item) => sum + item.rating, 0);
        const avg = totalRating / feedbackItems.length;
        setAverageRating(avg);
        
        const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedbackItems.forEach(item => {
          if (item.rating >= 1 && item.rating <= 5) {
            distribution[item.rating] += 1;
          }
        });
        setRatingDistribution(distribution);
      } else {
        setAverageRating(0);
        setRatingDistribution({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError(`Không thể tải dữ liệu đánh giá: ${err instanceof Error ? err.message : "Lỗi không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onOpenChange(false);
    }, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const filteredFeedback = selectedTab === "all" 
    ? feedbackData 
    : feedbackData.filter(fb => fb.rating === parseInt(selectedTab));

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={`${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
      />
    ));
  };

  const getRatingLabel = (rating: number) => {
    switch(rating) {
      case 5: return "Xuất sắc";
      case 4: return "Tốt";
      case 3: return "Bình thường";
      case 2: return "Không tốt";
      case 1: return "Kém";
      default: return "";
    }
  };

  const getFeedbackTimeline = () => {
    const groupedByMonth: { [key: string]: TFeedbackResponse[] } = {};
    
    feedbackData.forEach(feedback => {
      if (!feedback.createdAt) return;
      const date = new Date(feedback.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = [];
      }
      
      groupedByMonth[monthYear].push(feedback);
    });
    
    return Object.entries(groupedByMonth).map(([month, items]) => {
      const totalRating = items.reduce((sum, item) => sum + item.rating, 0);
      const avgRating = totalRating / items.length;
      
      return { month, count: items.length, avgRating };
    });
  };
  
  const timelineData = getFeedbackTimeline();

  if (!isOpen) return null;

  const popupContent = (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl transition-all duration-300 transform ${animateIn ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="feedback-popup-title"
        aria-modal="true"
      >
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-4 text-white flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
              <MessageCircle size={22} className="text-white" />
            </div>
            <div>
              <h3 id="feedback-popup-title" className="text-xl font-semibold">Đánh Giá Của Khách Hàng</h3>
              <p className="text-indigo-100 text-sm flex items-center">
                <Award size={14} className="mr-1" /> Nhân viên: <span className="font-medium ml-1">{staffName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-indigo-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(90vh-64px)]">
          <div className="w-full md:w-72 bg-gradient-to-b from-indigo-50 to-white p-4 border-r border-indigo-100 overflow-y-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-full -mt-10 -mr-10 z-0"></div>
              <div className="relative z-10">
                <h4 className="text-sm font-medium text-indigo-600 mb-2 flex items-center">
                  <ThumbsUp size={14} className="mr-1" /> Điểm Trung Bình
                </h4>
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {averageRating.toFixed(1)}
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar size={12} className="mr-1 text-indigo-500" />
                  <span>{feedbackData.length} đánh giá</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <BarChart2 size={16} className="mr-2 text-indigo-600" />
                Thống Kê Đánh Giá
              </h4>
              
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating] || 0;
                const percentage = feedbackData.length > 0 
                  ? Math.round((count / feedbackData.length) * 100) 
                  : 0;
                
                return (
                  <div key={rating} className="mb-3 group cursor-pointer" onClick={() => setSelectedTab(rating.toString())}>
                    <div className="flex items-center mb-1">
                      <div className="w-7 text-sm font-medium text-gray-700 flex items-center">
                        {rating} <Star size={12} className="ml-0.5 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="ml-1 text-xs font-medium text-gray-600">
                        {getRatingLabel(rating)}
                      </div>
                      <div className="ml-auto text-xs text-gray-500">
                        {count}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden group-hover:bg-gray-200 transition-colors">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          rating >= 4 ? "bg-green-500" : 
                          rating >= 3 ? "bg-yellow-500" : 
                          "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <Filter size={16} className="mr-2 text-indigo-600" />
                Lọc Theo Sao
              </h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedTab("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTab === "all" 
                      ? "bg-indigo-600 text-white shadow-md" 
                      : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200"
                  }`}
                >
                  Tất Cả
                </button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <button 
                    key={rating}
                    onClick={() => setSelectedTab(rating.toString())}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition-all ${
                      selectedTab === rating.toString() 
                        ? "bg-indigo-600 text-white shadow-md" 
                        : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200"
                    }`}
                  >
                    {rating} <Star size={10} className="ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {timelineData.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Clock size={16} className="mr-2 text-indigo-600" />
                  Biểu Đồ Thời Gian
                </h4>
                <div className="space-y-2">
                  {timelineData.map((period, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{period.month}</span>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(Math.round(period.avgRating))}
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                          {period.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
                  <p className="text-gray-500 text-sm font-medium">Đang tải đánh giá...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-center text-red-700">
                <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Có lỗi xảy ra</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <MessageCircle size={32} className="text-gray-400" />
                </div>
                <p className="font-medium text-gray-600">Không có đánh giá nào</p>
                {selectedTab !== "all" && (
                  <p className="text-sm mt-1">Thử chọn mức đánh giá khác</p>
                )}
                <button 
                  onClick={() => setSelectedTab("all")} 
                  className="mt-3 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Xem tất cả đánh giá
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MessageCircle size={18} className="mr-2 text-indigo-600" />
                    {selectedTab === "all" 
                      ? "Tất Cả Đánh Giá" 
                      : `Đánh Giá ${selectedTab} Sao`}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({filteredFeedback.length})
                    </span>
                  </h3>
                  <div className="text-sm text-gray-500">
                    {selectedTab !== "all" && (
                      <button 
                        onClick={() => setSelectedTab("all")}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center"
                      >
                        Xem tất cả <ChevronRight size={16} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {filteredFeedback.map((feedback) => (
                    <div 
                      key={feedback.id} 
                      className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(feedback.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-800 flex items-center">
                            {feedback.rating}/5
                            <span className="ml-2 text-xs text-gray-500">
                              ({getRatingLabel(feedback.rating)})
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1 text-indigo-500" />
                          {formatDate(feedback.createdAt)}
                        </div>
                      </div>
                      
                      {feedback.comments && (
                        <div className="mt-3 text-gray-700 bg-indigo-50 p-4 rounded-lg border-l-3 border-indigo-300">
                          <p className="whitespace-pre-line text-sm">{feedback.comments}</p>
                        </div>
                      )}
                      
                      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center text-xs text-gray-500">
                          <File size={12} className="mr-1 text-indigo-500" />
                          Mã đơn hàng: <span className="font-mono ml-1 bg-gray-100 px-1.5 py-0.5 rounded">{feedback.serviceOrderId.slice(0, 8)}...</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          feedback.status === "Active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {feedback.status === "Active" ? "Đang hoạt động" : feedback.status || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .border-l-3 {
          border-left-width: 3px;
        }
      `}</style>
    </div>
  );

  return createPortal(popupContent, document.body);
};

export default StaffFeedBackPopup;