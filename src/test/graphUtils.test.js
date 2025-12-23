import { describe, it, expect } from 'vitest';
import {
  isSelfLoop,
  isDuplicateEdge,
  isConnected,
  countConnectedComponents,
  validateGraphForMST
} from '../algorithms/graphUtils';

describe('graphUtils - Validation Functions', () => {
  describe('isSelfLoop', () => {
    it('should return true for self-loop', () => {
      expect(isSelfLoop(0, 0)).toBe(true);
      expect(isSelfLoop(5, 5)).toBe(true);
      expect(isSelfLoop(100, 100)).toBe(true);
    });

    it('should return false for different nodes', () => {
      expect(isSelfLoop(0, 1)).toBe(false);
      expect(isSelfLoop(5, 10)).toBe(false);
      expect(isSelfLoop(100, 200)).toBe(false);
    });
  });

  describe('isDuplicateEdge', () => {
    const edges = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 }
    ];

    it('should detect duplicate edge (same direction)', () => {
      expect(isDuplicateEdge(0, 1, edges)).toBe(true);
      expect(isDuplicateEdge(1, 2, edges)).toBe(true);
      expect(isDuplicateEdge(2, 3, edges)).toBe(true);
    });

    it('should detect duplicate edge (reverse direction)', () => {
      expect(isDuplicateEdge(1, 0, edges)).toBe(true);
      expect(isDuplicateEdge(2, 1, edges)).toBe(true);
      expect(isDuplicateEdge(3, 2, edges)).toBe(true);
    });

    it('should return false for non-duplicate edge', () => {
      expect(isDuplicateEdge(0, 2, edges)).toBe(false);
      expect(isDuplicateEdge(0, 3, edges)).toBe(false);
      expect(isDuplicateEdge(1, 3, edges)).toBe(false);
    });

    it('should handle empty edges array', () => {
      expect(isDuplicateEdge(0, 1, [])).toBe(false);
    });
  });

  describe('isConnected', () => {
    it('should return true for connected graph', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ];
      const edges = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      expect(isConnected(nodes, edges)).toBe(true);
    });

    it('should return false for disconnected graph', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];
      const edges = [
        { from: 0, to: 1 },
        // Node 2 and 3 are disconnected
      ];

      expect(isConnected(nodes, edges)).toBe(false);
    });

    it('should return true for single node', () => {
      const nodes = [{ id: 0 }];
      const edges = [];

      expect(isConnected(nodes, edges)).toBe(true);
    });

    it('should return true for empty graph', () => {
      expect(isConnected([], [])).toBe(true);
    });

    it('should handle cyclic graph', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ];
      const edges = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 0 }
      ];

      expect(isConnected(nodes, edges)).toBe(true);
    });
  });

  describe('countConnectedComponents', () => {
    it('should count 1 component for connected graph', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ];
      const edges = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      expect(countConnectedComponents(nodes, edges)).toBe(1);
    });

    it('should count multiple components for disconnected graph', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];
      const edges = [
        { from: 0, to: 1 },
        { from: 2, to: 3 }
      ];

      expect(countConnectedComponents(nodes, edges)).toBe(2);
    });

    it('should count each isolated node as separate component', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ];
      const edges = [];

      expect(countConnectedComponents(nodes, edges)).toBe(3);
    });

    it('should return 0 for empty graph', () => {
      expect(countConnectedComponents([], [])).toBe(0);
    });
  });

  describe('validateGraphForMST', () => {
    it('should validate correct MST graph', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ];
      const edges = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const result = validateGraphForMST(nodes, edges);
      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should reject empty graph', () => {
      const result = validateGraphForMST([], []);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('trống');
    });

    it('should reject single node graph', () => {
      const nodes = [{ id: 0 }];
      const edges = [];

      const result = validateGraphForMST(nodes, edges);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('1 trạm');
    });

    it('should reject graph with no edges', () => {
      const nodes = [
        { id: 0 },
        { id: 1 }
      ];
      const edges = [];

      const result = validateGraphForMST(nodes, edges);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('đường ray');
    });

    it('should reject graph with insufficient edges', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];
      const edges = [
        { from: 0, to: 1 }
      ];

      const result = validateGraphForMST(nodes, edges);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Không đủ');
    });

    it('should reject disconnected graph', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];
      const edges = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 2 }
        // Node 3 bị cô lập - có 3 edges (đủ n-1) nhưng vẫn disconnected
      ];

      const result = validateGraphForMST(nodes, edges);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('không liên thông');
    });

    it('should accept graph with extra edges (cycles)', () => {
      const nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ];
      const edges = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 0 }
      ];

      const result = validateGraphForMST(nodes, edges);
      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });
  });
});
