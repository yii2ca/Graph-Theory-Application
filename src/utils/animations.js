/**
 * Animation utilities
 * Hàm hỗ trợ animation và transitions
 */

/**
 * Easing functions
 */
export const easing = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => (--t) * t * t + 1,
};

/**
 * Animate giá trị từ start đến end
 * @param {number} start - Giá trị bắt đầu
 * @param {number} end - Giá trị kết thúc
 * @param {number} duration - Thời gian (ms)
 * @param {Function} callback - Callback nhận giá trị hiện tại
 * @param {Function} easingFunc - Hàm easing
 */
export const animateValue = (start, end, duration, callback, easingFunc = easing.easeInOutQuad) => {
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunc(progress);
    
    const currentValue = start + (end - start) * easedProgress;
    callback(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

/**
 * Delay promise
 * @param {number} ms - Milliseconds
 * @returns {Promise}
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Tạo pulse effect
 * @param {number} scale - Scale factor
 * @returns {Object} - CSS transform
 */
export const createPulse = (scale = 1.2) => {
  return {
    transform: `scale(${scale})`,
    transition: 'transform 0.3s ease-in-out'
  };
};
