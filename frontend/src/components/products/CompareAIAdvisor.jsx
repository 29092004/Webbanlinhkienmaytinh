/* eslint-disable no-useless-assignment */
import { useState } from "react";
import { Sparkles, Brain, CheckCircle, XCircle, ArrowRight, Lightbulb, ShoppingBag } from "lucide-react";
import { addProductToCart } from "@/lib/cartStore";
import { showToast } from "@/lib/toast";

export function CompareAIAdvisor({ products = [] }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisStep, setAnalysisStep] = useState("");

  if (products.length < 2) return null;

  const handleAddToCart = async (product) => {
    try {
      await addProductToCart({ productId: product.id, quantity: 1 });
      showToast({
        message: `Đã thêm ${product.name} vào giỏ hàng.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add product to cart from AI advice", error);
      showToast({
        message: "Không thêm được sản phẩm vào giỏ hàng.",
        type: "error",
      });
    }
  };

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep("Đang tải dữ liệu thông số kỹ thuật...");

    setTimeout(() => {
      setAnalysisStep("Đang phân tích hiệu năng và so sánh giá trị P/P...");
      setTimeout(() => {
        setAnalysisStep("Đang so sánh độ tương thích và soạn thảo báo cáo...");
        setTimeout(() => {
          const report = generateAnalysisReport(products);
          setAnalysisResult(report);
          setIsAnalyzing(false);
          setAnalysisStep("");
          showToast({ message: "Phân tích AI hoàn thành!", type: "success" });
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="bg-gradient-to-tr from-blue-50/40 via-indigo-50/20 to-white border border-blue-100 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">
              Trợ lý AI Đánh giá & Tư vấn Chọn mua
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Phân tích thông số kỹ thuật và so sánh lợi ích sử dụng giữa các sản phẩm
            </p>
          </div>
        </div>

        {!analysisResult && !isAnalyzing && (
          <button
            onClick={runAIAnalysis}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer shrink-0 uppercase"
          >
            <Sparkles className="size-4" />
            Nhờ AI tư vấn chọn mua
          </button>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="rounded-2xl bg-white border border-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Brain className="size-6 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-extrabold text-slate-700">Trợ lý AI đang làm việc</p>
            <p className="text-xs text-slate-400 font-semibold">{analysisStep}</p>
          </div>
        </div>
      )}

      {/* Result State */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Lightbulb className="size-4.5" />
              Tổng quan so sánh
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {analysisResult.summary}
            </p>
          </div>

          {/* Deep dive sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisResult.analysisPoints.map((point, index) => (
              <div key={index} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2 shadow-xs">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {point.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {point.content}
                </p>
              </div>
            ))}
          </div>

          {/* Pros / Cons for each product */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysisResult.productsEvaluation.map((pe, index) => (
              <div key={index} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1 mb-4" title={pe.name}>
                    {pe.name}
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Ưu điểm</div>
                      <ul className="space-y-1.5">
                        {pe.pros.map((pro, pIdx) => (
                          <li key={pIdx} className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                            <CheckCircle className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Nhược điểm</div>
                      <ul className="space-y-1.5">
                        {pe.cons.map((con, cIdx) => (
                          <li key={cIdx} className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                            <XCircle className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleAddToCart(pe.originalProduct)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ShoppingBag className="size-3.5" />
                    Chọn mua
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Verdict/Recommendation */}
          <div className="bg-indigo-600 rounded-2xl p-6 text-white space-y-4 shadow-lg shadow-indigo-100">
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
              <Sparkles className="size-4.5" />
              Lời khuyên chọn mua từ AI
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysisResult.verdicts.map((v, index) => (
                <div key={index} className="space-y-1.5 border-t md:border-t-0 md:border-l border-indigo-400/50 pt-4 md:pt-0 pl-0 md:pl-4 first:border-0 first:pl-0">
                  <div className="text-[11px] font-black tracking-widest text-indigo-200 uppercase">
                    {v.persona}
                  </div>
                  <div className="text-sm font-bold text-white leading-snug">
                    {v.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Redo analysis */}
          <div className="flex justify-end">
            <button
              onClick={runAIAnalysis}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1 cursor-pointer"
            >
              Phân tích lại <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Local AI evaluation generator
function generateAnalysisReport(products) {
  const categoryName = products[0]?.categoryName || "Sản phẩm";
  const names = products.map(p => p.name);
  // Sort products by price to find cheap vs expensive options
  const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
  const budgetProd = sortedByPrice[0];
  const premiumProd = sortedByPrice[sortedByPrice.length - 1];

  let summary = "";
  let analysisPoints = [];
  let productsEvaluation = [];
  let verdicts = [];

  // Determine category specific heuristics
  const cat = String(categoryName).toLowerCase();

  if (cat.includes("cpu") || cat.includes("chip")) {
    summary = `Báo cáo so sánh vi xử lý giữa các sản phẩm ${names.join(", ")}. Các sản phẩm này thuộc phân khúc khác nhau của các hãng dẫn đầu thị trường (Intel/AMD). Sản phẩm ${premiumProd.name} đại diện cho phân khúc cao cấp hơn với giá thành chênh lệch khoảng ${Number(premiumProd.price - budgetProd.price).toLocaleString("vi-VN")} đ so với ${budgetProd.name}.`;
    
    analysisPoints = [
      {
        title: "Hiệu năng tính toán (Multi-core & Single-core)",
        content: `Vi xử lý ${premiumProd.name} vượt trội hơn về hiệu năng nhờ số nhân và số luồng vượt trội hơn (thường có ${premiumProd.specs?.["Số nhân"] || "nhiều"} nhân so với ${budgetProd.specs?.["Số nhân"] || "ít"} nhân của bản cấp thấp). Khả năng đa nhiệm và render của ${premiumProd.name} tối ưu hơn rõ rệt.`,
      },
      {
        title: "Khả năng tương thích (Socket & Mainboard)",
        content: `Cần chú ý chuẩn Socket: ${products[0].name} chạy socket ${products[0].specs?.["Socket"] || "LGA1700"} trong khi ${products[1]?.name || "sản phẩm khác"} chạy socket ${products[1]?.specs?.["Socket"] || "AM4/AM5"}. Hãy chắc chắn chọn đúng bo mạch chủ tương thích để tránh xung đột phần cứng.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget 
          ? ["Mức giá cực kỳ kinh tế", "Điện năng tiêu thụ thấp (chỉ khoảng 65W)", "Tương thích tốt các mainboard giá rẻ"]
          : ["Hiệu năng đỉnh cao", "Số nhân luồng lớn, đáp ứng tốt đồ họa nặng", "Bộ nhớ đệm L3 cực lớn"],
        cons: isBudget
          ? ["Bị giới hạn khi đa tác vụ nặng", "Tốc độ xung nhịp cơ bản thấp hơn"]
          : ["Giá thành cao", "Nhiệt lượng tỏa ra lớn, cần tản nhiệt rời xịn", "Đòi hỏi nguồn công suất cao hơn"]
      };
    });

    verdicts = [
      {
        persona: "Game thủ phổ thông",
        recommendation: `Nên chọn ${budgetProd.name} để tiết kiệm chi phí dồn tiền vào GPU (Card đồ họa).`
      },
      {
        persona: "Nhà sáng tạo nội dung",
        recommendation: `Chọn ngay ${premiumProd.name} để rút ngắn 30-50% thời gian render video và làm đồ họa.`
      },
      {
        persona: "Tối ưu chi phí (P/P)",
        recommendation: `${budgetProd.name} đang có tỉ lệ hiệu năng trên giá thành vượt trội nhất.`
      }
    ];
  } 
  else if (cat.includes("gpu") || cat.includes("card") || cat.includes("đồ họa")) {
    summary = `Báo cáo so sánh card đồ họa rời (GPU). Đây là linh kiện quan trọng nhất cho trải nghiệm gaming và xử lý hình ảnh 3D. ${premiumProd.name} cung cấp băng thông bộ nhớ và năng lực dựng hình tốt hơn rõ rệt so với sản phẩm ${budgetProd.name}.`;
    
    analysisPoints = [
      {
        title: "Bộ nhớ VRAM & Băng thông",
        content: `Dung lượng VRAM là yếu tố quyết định khi chơi game ở độ phân giải cao hoặc render video 4K. Các sản phẩm này sở hữu dung lượng VRAM lớn (${premiumProd.specs?.["Dung lượng VRAM"] || "8GB"} GDDR6) giúp khử răng cưa và tải texture mượt mà.`,
      },
      {
        title: "Yêu cầu nguồn điện & Hệ thống tản nhiệt",
        content: `GPU hiệu năng cao đòi hỏi nguồn điện ổn định. Khuyến nghị sử dụng bộ nguồn tối thiểu từ ${premiumProd.specs?.["Nguồn đề nghị"] || "550W-650W"} chất lượng tốt cho hệ thống sử dụng ${premiumProd.name} nhằm tránh hiện tượng sụt áp khi tải nặng.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Giá bán cực kỳ dễ tiếp cận", "Kích thước gọn gàng dễ lắp case nhỏ", "Hoạt động mát mẻ"]
          : ["Khả năng xử lý Ray Tracing xuất sắc", "Hỗ trợ công nghệ DLSS thế hệ mới", "Khung hình ổn định ở độ phân giải 2K"],
        cons: isBudget
          ? ["Băng thông bộ nhớ bị giới hạn 128-bit", "Độ trễ khung hình tăng khi bật tối đa đồ họa"]
          : ["Giá cao", "Yêu cầu case máy tính có chiều dài lắp đặt thoải mái (thường là card 3 fan)"]
      };
    });

    verdicts = [
      {
        persona: "Game thủ Full HD 1080p",
        recommendation: `Chọn ${budgetProd.name} là quá đủ để chiến mượt mọi game Esports ở mức khung hình 100+ FPS.`
      },
      {
        persona: "Trải nghiệm AAA 2K / 4K",
        recommendation: `Bắt buộc phải đầu tư ${premiumProd.name} để bật max setting và các công nghệ AI Upscaling.`
      },
      {
        persona: "Người làm đồ họa AI",
        recommendation: `Chọn ${premiumProd.name} nhờ số nhân CUDA và kiến trúc lõi Tensor thế hệ mới giúp tối ưu hóa thuật toán deep learning.`
      }
    ];
  }
  else if (cat.includes("laptop")) {
    summary = `Đánh giá so sánh máy tính xách tay (Laptop). Cuộc so kè giữa ${names.join(" và ")} mang đến lựa chọn phong phú cho người dùng. ${premiumProd.name} tập trung vào sức mạnh phần cứng cấu hình cao trong khi ${budgetProd.name} mang lại sự cơ động và tối ưu về mặt tài chính.`;

    analysisPoints = [
      {
        title: "Cấu hình phần cứng & Hiệu năng thực tế",
        content: `${premiumProd.name} được trang bị vi xử lý cao cấp hơn (${premiumProd.specs?.["CPU"] || "i7/Ryzen 7"}) cùng card đồ họa rời mạnh mẽ, đáp ứng hoàn hảo cho lập trình, thiết kế đồ họa 3D và gaming nặng. ${budgetProd.name} phục vụ mượt mà các tác vụ văn phòng và học tập cơ bản.`,
      },
      {
        title: "Thiết kế & Độ cơ động di chuyển",
        content: `Đối với sinh viên và dân văn phòng, trọng lượng máy rất quan trọng. ${budgetProd.name} có điểm cộng lớn nhờ trọng lượng mỏng nhẹ (${budgetProd.specs?.["Trọng lượng"] || "dưới 1.8kg"}), dễ dàng bỏ ba lô di chuyển so với dòng laptop gaming hầm hố nặng nề hơn.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Trọng lượng siêu nhẹ, thiết kế sang trọng thanh lịch", "Thời lượng pin thực tế tốt hơn", "Mức giá quá tốt cho học sinh sinh viên"]
          : ["Hiệu năng phần cứng cực khủng với card rời", "Tần số quét màn hình cao (120Hz-144Hz) chơi game không xé hình", "Hệ thống tản nhiệt kép hoạt động hiệu quả"],
        cons: isBudget
          ? ["Không chiến được các game AAA nặng", "Khả năng nâng cấp RAM/SSD bị hạn chế"]
          : ["Khá nặng, củ sạc đi kèm cồng kềnh", "Pin nhanh hao khi chạy ở hiệu năng cao không cắm sạc"]
      };
    });

    verdicts = [
      {
        persona: "Sinh viên khối Kinh tế / Sư phạm",
        recommendation: `Chọn dòng máy mỏng nhẹ như ${budgetProd.name} để di chuyển giảng đường dễ dàng và pin lâu.`
      },
      {
        persona: "Sinh viên Công nghệ / Đồ họa",
        recommendation: `Chọn cấu hình mạnh mẽ của ${premiumProd.name} để chạy mượt các phần mềm thiết kế và máy ảo lập trình.`
      },
      {
        persona: "Giải trí đa phương tiện",
        recommendation: `${premiumProd.name} mang lại trải nghiệm xem phim, chơi game đỉnh cao nhờ màn hình quét cao và loa tốt.`
      }
    ];
  }
  else if (cat.includes("ssd") || cat.includes("ổ cứng") || cat.includes("hdd")) {
    summary = `Báo cáo so sánh giải pháp lưu trữ tốc độ cao (SSD/HDD) giữa các mã ${names.join(", ")}. Tốc độ phản hồi hệ thống sẽ thay đổi rõ rệt tùy thuộc vào chuẩn kết nối giao tiếp của ổ cứng bạn lựa chọn.`;

    analysisPoints = [
      {
        title: "Tốc độ đọc/ghi dữ liệu (Read/Write Speed)",
        content: `Ổ SSD sử dụng giao tiếp PCIe Gen 4 như ${premiumProd.name} đạt tốc độ đọc ấn tượng (${premiumProd.specs?.["Tốc độ đọc"] || "7000 MB/s"}), nhanh gấp đôi so với các dòng PCIe Gen 3 và gấp 14 lần ổ SSD SATA III thông thường.`,
      },
      {
        title: "Độ bền hoạt động (TBW) & Công nghệ bộ nhớ đệm DRAM",
        content: `Sản phẩm cao cấp có tích hợp chip nhớ đệm DRAM giúp tốc độ truyền file lớn không bị sụt giảm đột ngột và tăng tuổi thọ ghi dữ liệu (TBW cao lên đến 600TBW).`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Giá siêu rẻ để có dung lượng 1TB", "Chạy rất mát không cần tản nhiệt nhôm", "Phù hợp làm ổ lưu trữ phụ"]
          : ["Tốc độ đọc ghi top đầu phân khúc", "Tích hợp DRAM cache cao cấp", "Thời gian bảo hành dài lâu (lên đến 60 tháng)"],
        cons: isBudget
          ? ["Tốc độ ghi file lớn bị sụt giảm khi đầy bộ nhớ tạm", "Không có DRAM cache riêng biệt"]
          : ["Giá thành cao hơn khoảng 50-80%", "Tỏa nhiệt cao khi hoạt động hết công suất"]
      };
    });

    verdicts = [
      {
        persona: "Ổ đĩa cài Hệ điều hành (C: Drive)",
        recommendation: `Nên chọn ổ cao cấp như ${premiumProd.name} để bật máy nhanh, mở app tức thì và bền bỉ.`
      },
      {
        persona: "Ổ đĩa lưu trữ Game & Phụ dữ liệu",
        recommendation: `Chọn phương án kinh tế ${budgetProd.name} để lưu game dung lượng lớn không cần tốc độ tuyệt đối.`
      },
      {
        persona: "Người làm dựng phim chuyên nghiệp",
        recommendation: `Bắt buộc chọn ${premiumProd.name} để import các file source RAW 4K mượt mà không bị nghẽn.`
      }
    ];
  }
  else if (cat.includes("chair") || cat.includes("ghế")) {
    summary = `Báo cáo phân tích so sánh ghế chơi game (Gaming Chair) giữa ${names.join(" và ")}. Các mẫu ghế này được thiết kế theo công thái học để nâng đỡ cột sống tốt nhất, phù hợp cho người dùng ngồi làm việc hoặc chơi game liên tục nhiều giờ liền.`;

    analysisPoints = [
      {
        title: "Chất liệu hoàn thiện & Thiết kế công thái học",
        content: `Cả hai sản phẩm đều sở hữu chất liệu da cao cấp (${premiumProd.specs?.["Chất liệu"] || "da PU / vải lưới"}) mang lại cảm giác êm ái khi ngồi. Dòng cao cấp ${premiumProd.name} được chú trọng hơn ở chất lượng đường may và đệm đúc nguyên khối chống xẹp lún tốt hơn.`,
      },
      {
        title: "Khung nâng đỡ & Tính năng điều chỉnh tay vịn/góc ngả",
        content: `Ghế ${premiumProd.name} vượt trội nhờ tay vịn điều chỉnh đa hướng (${premiumProd.specs?.["Loại tay vịn"] || "4D"}), trong khi dòng giá rẻ sử dụng tay vịn (${budgetProd.specs?.["Loại tay vịn"] || "2D"}). Góc ngả lưng rộng (${premiumProd.specs?.["Góc ngả"] || "160-180 độ"}) cho phép ngả phẳng để nằm nghỉ ngơi tại chỗ vô cùng tiện lợi.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Mức giá vô cùng hợp lý", "Đệm ngồi dày dặn, đầy đủ gối tựa cổ và tựa lưng", "Dễ lau chùi vệ sinh chất liệu da"]
          : ["Khung thép đúc siêu chắc chắn chịu tải trọng lớn", "Tay vịn 4D điều chỉnh cực linh hoạt chống mỏi vai gáy", "Chân đế kim loại bền bỉ hơn chân nhựa", "Góc ngả lưng lớn để nghỉ ngơi thoải mái"],
        cons: isBudget
          ? ["Tay vịn chỉ điều chỉnh được 2D cơ bản", "Chân đế nhựa/nylon chịu lực kém hơn chân kim loại", "Góc ngả lưng hẹp hơn"]
          : ["Giá thành cao hơn", "Ghế khá to và nặng, khó vận chuyển lắp đặt"]
      };
    });

    verdicts = [
      {
        persona: "Người ngồi làm việc / chơi game trên 8 tiếng",
        recommendation: `Bắt buộc chọn dòng cao cấp như ${premiumProd.name} nhờ tay vịn 4D và đệm đỡ cột sống chất lượng để bảo vệ sức khỏe lâu dài.`
      },
      {
        persona: "Tối ưu ngân sách",
        recommendation: `Chọn dòng ghế ${budgetProd.name} giúp tiết kiệm chi phí nhưng vẫn đảm bảo sự êm ái và đầy đủ phụ kiện tựa đầu.`
      },
      {
        persona: "Nhu cầu nghỉ ngơi tại chỗ",
        recommendation: `Chọn dòng có góc ngả lưng lớn (160 - 180 độ) như ${premiumProd.name} hoặc tương đương để ngả phẳng thoải mái.`
      }
    ];
  }
  else if (cat.includes("ram") || cat.includes("bộ nhớ")) {
    summary = `Báo cáo so sánh bộ nhớ RAM giữa các mã ${names.join(", ")}. RAM đóng vai trò là bộ nhớ tạm của hệ thống, dung lượng và tốc độ bus cao giúp giảm nghẽn tối đa khi chơi game nặng và chạy các phần mềm đồ họa chuyên nghiệp.`;

    analysisPoints = [
      {
        title: "Dung lượng bộ nhớ & Khả năng đa nhiệm",
        content: `Sản phẩm ${premiumProd.name} sở hữu dung lượng lớn (${premiumProd.specs?.["Dung lượng"] || "32GB"}) giúp hệ thống mở hàng trăm tab trình duyệt, chạy song song các phần mềm đồ họa và game AAA thoải mái mà không bị báo thiếu RAM như bản dung lượng thấp (${budgetProd.specs?.["Dung lượng"] || "16GB"}).`,
      },
      {
        title: "Thế hệ RAM & Tốc độ Bus",
        content: `Cần đặc biệt lưu ý về chuẩn RAM: ${products[0].name} là chuẩn ${products[0].specs?.["Loại RAM"] || "DDR4/DDR5"} với bus ${products[0].specs?.["Tốc độ Bus"] || "3200MHz/5600MHz"}. Đảm bảo mainboard của bạn hỗ trợ đúng khe cắm DDR4 hoặc DDR5 tương thích.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Mức giá cực tốt, dễ tiếp cận", "Tương thích diện rộng với nhiều hệ thống cũ", "Tiêu thụ ít điện năng hơn"]
          : ["Băng thông cực rộng (chuẩn DDR5 mới)", "Dung lượng dư dả cho mọi tác vụ nặng", "Tích hợp tản nhiệt nhôm xịn giúp mát mẻ"],
        cons: isBudget
          ? ["Dung lượng 16GB có thể bắt đầu thiếu thốn với game mới năm 2026", "Tốc độ Bus thấp hơn chuẩn DDR5 thế hệ mới"]
          : ["Giá thành cao", "Yêu cầu bo mạch chủ đời mới hỗ trợ khe cắm DDR5"]
      };
    });

    verdicts = [
      {
        persona: "Tác vụ văn phòng & Game nhẹ",
        recommendation: `RAM 16GB từ ${budgetProd.name} là lựa chọn hoàn hảo và tiết kiệm nhất.`
      },
      {
        persona: "Lập trình viên / Đồ họa chuyên nghiệp",
        recommendation: `Khuyên dùng dung lượng 32GB từ ${premiumProd.name} để không lo hết RAM khi build code.`
      },
      {
        persona: "Tối ưu tương lai",
        recommendation: `Chọn chuẩn DDR5 như ${premiumProd.name} giúp đồng bộ tốt với các CPU/Mainboard thế hệ mới.`
      }
    ];
  }
  else if (cat.includes("mainboard") || cat.includes("bo mạch")) {
    summary = `Báo cáo so sánh bo mạch chủ (Mainboard) giữa ${names.join(" và ")}. Đây là xương sống kết nối toàn bộ linh kiện. Sự khác biệt về chipset và phase nguồn quyết định khả năng ép xung cũng như độ bền bỉ của hệ thống.`;

    analysisPoints = [
      {
        title: "Chipset & Socket tương thích",
        content: `Mainboard ${premiumProd.name} sử dụng chipset trung/cao cấp (${premiumProd.specs?.["Chipset"] || "B760/B650"}) giúp cấp nguồn ổn định hơn cho các CPU đa nhân mạnh mẽ. Cần chú ý socket để cắm vừa CPU của bạn.`,
      },
      {
        title: "Kết nối không dây & Cổng mở rộng M.2/SATA",
        content: `Mẫu bo mạch chủ cao cấp có tích hợp sẵn kết nối mạng không dây (${premiumProd.specs?.["WiFi"] || "Không tích hợp/Có WiFi"}), giúp kết nối internet tiện lợi không cần dây mạng LAN. Ngoài ra số khe cắm ổ M.2 nhiều hơn giúp mở rộng lưu trữ dễ dàng.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Giá rẻ, tiết kiệm chi phí build máy", "Kích thước mATX gọn gàng", "Vẫn đáp ứng đầy đủ cổng cắm cơ bản"]
          : ["Hệ thống tụ nguồn phase nguồn mạnh mẽ ổn định", "Có sẵn tản nhiệt cho khe M.2 SSD", "Tích hợp sẵn WiFi và LAN 2.5Gb tốc độ cao"],
        cons: isBudget
          ? ["Không hỗ trợ ép xung mạnh mẽ", "Khả năng tản nhiệt VRM ở mức cơ bản", "Ít khe cắm nâng cấp linh kiện"]
          : ["Giá thành cao", "Yêu cầu vỏ case phù hợp với kích thước mainboard"]
      };
    });

    verdicts = [
      {
        persona: "Lắp CPU i3 / i5 non-K hoặc Ryzen 5",
        recommendation: `Chọn dòng bo mạch chủ tiết kiệm như ${budgetProd.name} để tối ưu chi phí.`
      },
      {
        persona: "Lắp CPU cao cấp i7/i9 hoặc Ryzen 7/9",
        recommendation: `Bắt buộc chọn bo mạch chủ chất lượng cao như ${premiumProd.name} để cấp điện đầy đủ.`
      },
      {
        persona: "Nhu cầu không gian không dây gọn gàng",
        recommendation: `Nên chọn các phiên bản tích hợp WiFi sẵn như ${premiumProd.name} để hạn chế đi dây LAN trong phòng.`
      }
    ];
  }
  else if (cat.includes("power") || cat.includes("nguồn")) {
    summary = `Báo cáo so sánh bộ nguồn máy tính (PSU). Bộ nguồn đóng vai trò huyết mạch cung cấp điện năng cho toàn bộ hệ thống. Chọn đúng công suất và chuẩn hiệu suất là cực kỳ quan trọng để bảo vệ tuổi thọ linh kiện đắt tiền.`;

    analysisPoints = [
      {
        title: "Công suất thực tế & Chuẩn hiệu suất 80 Plus",
        content: `Bộ nguồn cao cấp có công suất lớn (${premiumProd.specs?.["Công suất"] || "750W"}) đạt chứng chỉ hiệu suất cao (${premiumProd.specs?.["Chuẩn hiệu suất"] || "80 Plus Gold"}), giúp chuyển đổi điện năng hiệu quả hơn, giảm lượng nhiệt tỏa ra và tiết kiệm điện đáng kể so với dòng phổ thông (${budgetProd.specs?.["Chuẩn hiệu suất"] || "80 Plus Bronze"}).`,
      },
      {
        title: "Thiết kế dây cáp (Modular vs Non-Modular)",
        content: `Dòng nguồn cao cấp hỗ trợ thiết kế cáp Full-Modular (${premiumProd.specs?.["Kiểu dây"] || "Full-Modular"}), cho phép tháo rời toàn bộ dây cáp không sử dụng, giúp đi dây trong vỏ case cực kỳ gọn gàng và tối ưu lưu thông luồng khí tản nhiệt.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Giá thành rẻ", "Đầy đủ đầu cấp nguồn cơ bản cho dàn máy trung cấp", "Hoạt động tương đối ổn định"]
          : ["Hiệu suất chuyển đổi cao đạt chuẩn Gold", "Thiết kế cáp rời toàn bộ vô cùng gọn gàng", "Hệ thống mạch bảo vệ nguồn cao cấp (OVP/SCP/OTP)", "Thời gian bảo hành vượt trội (lên đến 60 tháng)"],
        cons: isBudget
          ? ["Hiệu suất Bronze tỏa nhiều nhiệt hơn", "Cáp dính liền vỏ nguồn gây rối case khó đi dây", "Bảo hành ngắn hơn (chỉ 36 tháng)"]
          : ["Giá thành cao", "Dây cáp tháo rời đòi hỏi lắp ráp cẩn thận"]
      };
    });

    verdicts = [
      {
        persona: "Dàn PC dùng card RTX 4060 trở xuống",
        recommendation: `Chọn nguồn công suất vừa phải như ${budgetProd.name} là đủ đáp ứng tốt.`
      },
      {
        persona: "Dàn PC cấu hình mạnh dùng card RTX 4070 trở lên",
        recommendation: `Bắt buộc phải đầu tư nguồn từ 750W Gold trở lên như ${premiumProd.name} để chạy ổn định.`
      },
      {
        persona: "Thẩm mỹ đi dây & Vỏ case kính cường lực",
        recommendation: `Chọn nguồn Full-Modular như ${premiumProd.name} để đi dây gọn gàng và đẹp mắt nhất.`
      }
    ];
  }
  else if (cat.includes("monitor") || cat.includes("màn hình")) {
    summary = `Báo cáo so sánh màn hình hiển thị (Monitor) giữa ${names.join(" và ")}. Chất lượng tấm nền và tốc độ phản hồi quyết định trực tiếp tới độ thoải mái của mắt khi làm việc và chơi game trong thời gian dài.`;

    analysisPoints = [
      {
        title: "Tần số quét (Refresh Rate) & Thời gian phản hồi (Response Time)",
        content: `Sản phẩm ${premiumProd.name} phục vụ tốt cho nhu cầu giải trí và chơi game nhờ tần số quét cao (${premiumProd.specs?.["Tần số quét"] || "144Hz - 165Hz"}), mang lại chuyển động hình ảnh mượt mà, không bóng mờ so với màn hình văn phòng thông thường (${budgetProd.specs?.["Tần số quét"] || "60Hz"}).`,
      },
      {
        title: "Tấm nền (Panel Type) & Độ chuẩn màu",
        content: `Tấm nền IPS của các màn hình này giúp màu sắc hiển thị rực rỡ, chân thực và không bị biến đổi khi nhìn nghiêng. Màn hình văn phòng tập trung vào bảo vệ mắt và góc nghiêng công thái học.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Mức giá cực mềm", "Phù hợp tác vụ văn phòng văn bản thông thường", "Thiết kế tối giản sang trọng"]
          : ["Tần số quét cao chơi game bắn súng/đua xe siêu mượt", "Thời gian phản hồi nhanh 1ms loại bỏ bóng mờ", "Màu sắc hiển thị đẹp mắt"],
        cons: isBudget
          ? ["Tần số quét 60Hz bị giật khung hình khi chơi game nhanh", "Thiếu các công nghệ đồng bộ card đồ họa G-Sync/FreeSync"]
          : ["Giá thành cao hơn", "Có thể tỏa nhiệt nhiều hơn một chút do độ sáng cao"]
      };
    });

    verdicts = [
      {
        persona: "Nhân viên văn phòng & Học sinh",
        recommendation: `Chọn màn hình tiết kiệm như ${budgetProd.name} giúp xem văn bản, đọc báo thoải mái và tiết kiệm tiền.`
      },
      {
        persona: "Game thủ Esport chuyên nghiệp",
        recommendation: `Bắt buộc chọn màn hình tần số quét cao đời mới từ 144Hz trở lên như ${premiumProd.name}.`
      },
      {
        persona: "Làm đồ họa / Design ảnh",
        recommendation: `Nên chọn các dòng màn hình sử dụng tấm nền IPS sắc nét để hiển thị màu chuẩn xác nhất.`
      }
    ];
  }
  else if (
    cat.includes("keyboard") ||
    cat.includes("bàn phím") ||
    cat.includes("mouse") ||
    cat.includes("chuột") ||
    cat.includes("headphone") ||
    cat.includes("tai nghe") ||
    cat.includes("speaker") ||
    cat.includes("loa") ||
    cat.includes("webcam")
  ) {
    summary = `Báo cáo đánh giá so sánh thiết bị ngoại vi và phụ kiện tương tác giữa các sản phẩm ${names.join(", ")}. Các sản phẩm này trực tiếp ảnh hưởng tới trải nghiệm gõ phím, di chuột hoặc nghe âm thanh của bạn.`;

    analysisPoints = [
      {
        title: "Độ nhạy phản hồi & Cảm giác sử dụng",
        content: `Các sản phẩm cao cấp được trang bị linh kiện cao cấp hơn (ví dụ: switch cơ học cho bàn phím, cảm biến mắt đọc có DPI cao cho chuột, hoặc màng loa lớn cho tai nghe), giúp tốc độ phản hồi cực kỳ chính xác và mang lại cảm giác thoải mái khi tương tác.`,
      },
      {
        title: "Thiết kế công thái học & Đèn nền RGB",
        content: `Thiết kế công thái học giúp ôm tay (cho chuột) hoặc nâng cổ tay (cho bàn phím) chống mỏi khớp khi dùng lâu. Tích hợp đèn LED RGB sinh động giúp tăng tính thẩm mỹ đáng kể cho góc máy tính của bạn.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Giá thành rẻ vô cùng cạnh tranh", "Thiết kế nhỏ gọn, cắm vào là chạy ngay", "Hoạt động bền bỉ tin cậy"]
          : ["Trang bị công nghệ hàng đầu (switch cơ, cảm biến quang học cao cấp)", "Tích hợp đèn LED RGB rực rỡ tùy chỉnh", "Chất liệu phím/nhựa cứng cáp hơn, độ bền phím bấm cao"],
        cons: isBudget
          ? ["Cảm giác gõ phím hoặc di chuột ở mức trung bình", "Không hỗ trợ tùy biến nút bấm qua phần mềm"]
          : ["Giá thành cao hơn", "Có thể phát ra tiếng gõ/click ồn hơn (đối với bàn phím cơ)"]
      };
    });

    verdicts = [
      {
        persona: "Học tập & Gõ văn phòng cơ bản",
        recommendation: `Chọn sản phẩm giá tốt như ${budgetProd.name} là quá đủ để phục vụ công việc hàng ngày.`
      },
      {
        persona: "Game thủ cày cuốc / Leo rank",
        recommendation: `Nên chọn phụ kiện cao cấp như ${premiumProd.name} để có độ chính xác từng mili-giây và không bỏ lỡ thao tác.`
      },
      {
        persona: "Nhu cầu yên tĩnh ban đêm",
        recommendation: `Hãy kiểm tra kỹ các loại switch hoặc nút bấm Silent để tránh gây ồn cho người xung quanh.`
      }
    ];
  }
  else {
    // General fallback template for categories like Case, Fans, etc. (Hardware-neutral)
    summary = `Báo cáo so sánh chi tiết sản phẩm dòng ${categoryName} bao gồm các sản phẩm: ${names.join(", ")}. Các sản phẩm này đáp ứng tốt các nhu cầu kỹ thuật và tính năng sử dụng trong phân khúc của mình.`;

    analysisPoints = [
      {
        title: "Chất lượng hoàn thiện & Tính ổn định",
        content: `Sản phẩm cao cấp hơn sở hữu chất lượng hoàn thiện tốt hơn từ các thương hiệu lớn, vật liệu chế tạo bền bỉ hơn giúp nâng cao hiệu suất hoạt động và tuổi thọ sử dụng.`,
      },
      {
        title: "Tối ưu hóa chi phí & Bảo hành",
        content: `Sản phẩm phân khúc cao hơn thường mang lại khả năng gia công tốt hơn, hoạt động êm ái ổn định dưới tải nặng và được nhà sản xuất cam kết bảo hành lâu dài chính hãng, giúp yên tâm sử dụng trong nhiều năm.`,
      }
    ];

    productsEvaluation = products.map(p => {
      const isBudget = p.id === budgetProd.id;
      return {
        name: p.name,
        originalProduct: p,
        pros: isBudget
          ? ["Mức giá cực kỳ tối ưu, tiết kiệm chi phí", "Đầy đủ tính năng tiêu chuẩn để vận hành ổn định", "Thiết kế gọn gàng, độ tương thích rộng rãi"]
          : ["Chất lượng hoàn thiện cao cấp, độ bền vượt trội", "Thiết kế bắt mắt, vật liệu gia công chắc chắn", "Chế độ bảo hành lâu dài chính hãng"],
        cons: isBudget
          ? ["Thiếu một số tính năng bổ trợ nâng cao", "Vật liệu chế tạo ở mức cơ bản"]
          : ["Giá thành cao hơn", "Có thể chiếm nhiều không gian hoặc đòi hỏi phụ kiện đi kèm tương ứng"]
      };
    });

    verdicts = [
      {
        persona: "Tối ưu ngân sách ban đầu",
        recommendation: `Nên chọn ${budgetProd.name} để có giải pháp kinh tế nhất cho nhu cầu sử dụng tiêu chuẩn.`
      },
      {
        persona: "Nhu cầu lâu dài bền bỉ",
        recommendation: `Đầu tư vào ${premiumProd.name} để sở hữu sản phẩm có độ hoàn thiện và tuổi thọ tốt nhất.`
      },
      {
        persona: "Khuyên dùng tổng quan",
        recommendation: `Nếu ngân sách thoải mái, ${premiumProd.name} là sự lựa chọn mang lại trải nghiệm trọn vẹn và an tâm nhất.`
      }
    ];
  }

  return {
    summary,
    analysisPoints,
    productsEvaluation,
    verdicts
  };
}
