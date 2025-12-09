"use client";

import React, { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Responsive, WidthProvider } from "react-grid-layout";
import type { GridItem } from "@/types/grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// WidthProvider کمک می‌کند گرید عرض کانتینر را بفهمد
const ResponsiveGridLayout = WidthProvider(Responsive);

const ReactGridLayoutContainer: FC<{ items: GridItem[] }> = ({ items }) => {
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  // تشخیص زبان فعلی از URL
  const isRtl = params?.lang === "fa";

  // جلوگیری از ارور Hydration در Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // می‌تونی اینجا یک لودینگ یا اسکلتون ساده بذاری تا صفحه پرش نداشته باشه
    return <div className="min-h-screen w-full animate-pulse bg-transparent" />;
  }

  return (
    // ⭐️ نکته ۱: کانتینر اصلی همیشه LTR باشه تا محاسبات X و Y بهم نریزه
    <div className="w-full min-h-screen pb-20" dir="ltr">
      <ResponsiveGridLayout
        // بریک‌پوینت‌های استاندارد Tailwind
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        // تعداد ستون‌ها (توی دسکتاپ ۴ تا برای بنتو گرید عالیه)
        cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 1 }}
        // ارتفاع هر ردیف (پیکسل). این عدد رو تغییر بده تا باکس‌ها مربعی‌تر بشن
        rowHeight={120} 
        // فاصله بین باکس‌ها [x, y] -> معادل gap-4
        margin={[16, 16]}
        className="layout"
        // کلاس‌هایی برای تجربه کاربری بهتر هنگام درگ کردن
        draggableCancel=".not-drag" // کلاس برای جلوگیری از درگ روی دکمه‌ها/اینپوت‌های داخل کارت
        isDraggable={true}
        isResizable={false} // معمولا بنتو گریدها ریسایز نمیشن، اگه خواستی true کن
        useCSSTransforms={true} // پرفورمنس بهتر با GPU
      >
        {items.map((item) => (
          <div
            key={item.key}
            data-grid={{
              i: item.key,
              x: item.x ?? 0,
              y: item.y ?? 0,
              w: item.width,
              h: item.height,
              // پین کردن آیتم‌ها اگه لازم بود (static)
              static: false 
            }}
            // استایل‌های پایه برای باکس‌ها
            className="group relative select-none touch-none"
            // ⭐️ نکته ۲: اینجا دایرکشن رو برمی‌گردونیم به حالت درست زبان
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* یک رپر داخلی برای هندل کردن ارتفاع کامل */}
            <div className="h-full w-full overflow-hidden transition-all duration-300 ease-in-out">
              {item.component}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default ReactGridLayoutContainer;
