/**
 * Union-Find (Disjoint Set) Data Structure
 * Dùng để kiểm tra và hợp nhất các tập hợp rời rạc
 * Sử dụng trong thuật toán Kruskal để tránh chu trình
 */
export class UnionFind {
  /**
   * Khởi tạo Union-Find với n phần tử
   * @param {number} n - Số lượng phần tử
   */
  constructor(n) {
    // Mỗi phần tử ban đầu là tập hợp riêng
    this.parent = Array.from({ length: n }, (_, i) => i);
    
    // Rank để tối ưu hóa (union by rank)
    this.rank = Array(n).fill(0);
  }

  /**
   * Tìm đại diện (root) của tập hợp chứa x
   * Sử dụng Path Compression để tối ưu
   * @param {number} x - Phần tử cần tìm
   * @returns {number} - Đại diện của tập hợp
   */
  find(x) {
    if (this.parent[x] !== x) {
      // Path compression: gán parent trực tiếp về root
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  /**
   * Hợp nhất 2 tập hợp chứa x và y
   * @param {number} x - Phần tử thứ nhất
   * @param {number} y - Phần tử thứ hai
   * @returns {boolean} - true nếu hợp nhất thành công, false nếu đã cùng tập
   */
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    // Nếu đã cùng tập, không hợp nhất (tránh chu trình)
    if (rootX === rootY) {
      return false;
    }

    // Union by rank: gắn cây thấp vào cây cao
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }

  /**
   * Kiểm tra 2 phần tử có cùng tập không
   * @param {number} x - Phần tử thứ nhất
   * @param {number} y - Phần tử thứ hai
   * @returns {boolean}
   */
  isConnected(x, y) {
    return this.find(x) === this.find(y);
  }
}
