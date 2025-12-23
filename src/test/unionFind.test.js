import { describe, it, expect } from 'vitest';
import { UnionFind } from '../algorithms/unionFind';

describe('UnionFind Data Structure', () => {
  describe('Constructor', () => {
    it('should initialize with n elements', () => {
      const uf = new UnionFind(5);
      
      // Each element should be its own parent initially
      expect(uf.parent).toEqual([0, 1, 2, 3, 4]);
      expect(uf.rank).toEqual([0, 0, 0, 0, 0]);
    });

    it('should handle zero elements', () => {
      const uf = new UnionFind(0);
      expect(uf.parent).toEqual([]);
      expect(uf.rank).toEqual([]);
    });
  });

  describe('find()', () => {
    it('should return element itself for isolated element', () => {
      const uf = new UnionFind(5);
      
      expect(uf.find(0)).toBe(0);
      expect(uf.find(1)).toBe(1);
      expect(uf.find(4)).toBe(4);
    });

    it('should return root after union', () => {
      const uf = new UnionFind(5);
      
      uf.union(0, 1);
      const root0 = uf.find(0);
      const root1 = uf.find(1);
      
      // Both should have same root
      expect(root0).toBe(root1);
    });

    it('should perform path compression', () => {
      const uf = new UnionFind(5);
      
      // Create chain: 0 -> 1 -> 2
      uf.union(1, 2);
      uf.union(0, 1);
      
      const root = uf.find(0);
      
      // After find with path compression, 0 should point directly to root
      expect(uf.parent[0]).toBe(root);
    });
  });

  describe('union()', () => {
    it('should return true when uniting different sets', () => {
      const uf = new UnionFind(5);
      
      const result = uf.union(0, 1);
      expect(result).toBe(true);
    });

    it('should return false when uniting same set', () => {
      const uf = new UnionFind(5);
      
      uf.union(0, 1);
      const result = uf.union(0, 1); // Try to unite again
      
      expect(result).toBe(false);
    });

    it('should connect elements transitively', () => {
      const uf = new UnionFind(5);
      
      uf.union(0, 1);
      uf.union(1, 2);
      uf.union(2, 3);
      
      // All should have same root
      const root0 = uf.find(0);
      const root3 = uf.find(3);
      expect(root0).toBe(root3);
    });

    it('should detect cycles', () => {
      const uf = new UnionFind(4);
      
      expect(uf.union(0, 1)).toBe(true);
      expect(uf.union(1, 2)).toBe(true);
      expect(uf.union(2, 3)).toBe(true);
      
      // Creating cycle: 3 -> 0 (already connected)
      expect(uf.union(3, 0)).toBe(false);
    });

    it('should use union by rank', () => {
      const uf = new UnionFind(5);
      
      // Union smaller rank to larger rank
      uf.union(0, 1);
      uf.union(2, 3);
      
      const rankBefore0 = uf.rank[uf.find(0)];
      const rankBefore2 = uf.rank[uf.find(2)];
      
      // Union two trees of same rank should increase rank
      uf.union(0, 2);
      
      const rootAfter = uf.find(0);
      expect(uf.rank[rootAfter]).toBeGreaterThanOrEqual(Math.max(rankBefore0, rankBefore2));
    });
  });

  describe('MST Use Case', () => {
    it('should correctly track connected components for MST', () => {
      const uf = new UnionFind(4);
      const edges = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 },
        { from: 2, to: 3, weight: 3 },
        { from: 3, to: 0, weight: 4 } // This creates a cycle
      ];

      const mstEdges = [];
      
      for (const edge of edges) {
        if (uf.union(edge.from, edge.to)) {
          mstEdges.push(edge);
        }
      }

      // MST should have exactly n-1 edges (3 edges for 4 nodes)
      expect(mstEdges.length).toBe(3);
      
      // Should not include the cycle-creating edge
      expect(mstEdges).not.toContainEqual(
        expect.objectContaining({ from: 3, to: 0 })
      );
    });

    it('should handle multiple components', () => {
      const uf = new UnionFind(6);
      
      // Create two separate components
      uf.union(0, 1);
      uf.union(1, 2); // Component 1: {0, 1, 2}
      
      uf.union(3, 4);
      uf.union(4, 5); // Component 2: {3, 4, 5}
      
      // Elements in same component should have same root
      expect(uf.find(0)).toBe(uf.find(2));
      expect(uf.find(3)).toBe(uf.find(5));
      
      // Elements in different components should have different roots
      expect(uf.find(0)).not.toBe(uf.find(3));
    });
  });

  describe('Edge Cases', () => {
    it('should handle single element', () => {
      const uf = new UnionFind(1);
      
      expect(uf.find(0)).toBe(0);
    });

    it('should handle large number of elements', () => {
      const n = 1000;
      const uf = new UnionFind(n);
      
      // Union all elements sequentially
      for (let i = 0; i < n - 1; i++) {
        expect(uf.union(i, i + 1)).toBe(true);
      }
      
      // All elements should be in same set
      const root = uf.find(0);
      for (let i = 1; i < n; i++) {
        expect(uf.find(i)).toBe(root);
      }
    });
  });
});
