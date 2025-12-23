import { describe, it, expect } from 'vitest';
import { kruskalMST, primMST } from '../algorithms/mst';

describe('MST Algorithms', () => {
  // Helper function to create test graph
  const createTestGraph = () => {
    const nodes = [
      { id: 0, x: 0, y: 0, label: 'A' },
      { id: 1, x: 100, y: 0, label: 'B' },
      { id: 2, x: 100, y: 100, label: 'C' },
      { id: 3, x: 0, y: 100, label: 'D' }
    ];

    const edges = [
      { from: 0, to: 1, weight: 10 },
      { from: 1, to: 2, weight: 15 },
      { from: 2, to: 3, weight: 20 },
      { from: 3, to: 0, weight: 25 },
      { from: 0, to: 2, weight: 30 } // Diagonal
    ];

    return { nodes, edges };
  };

  describe('Kruskal MST', () => {
    it('should return empty MST for less than 2 nodes', () => {
      const result = kruskalMST([], []);
      expect(result.mstEdges).toEqual([]);
      expect(result.totalCost).toBe(0);

      const result2 = kruskalMST([{ id: 0 }], []);
      expect(result2.mstEdges).toEqual([]);
      expect(result2.totalCost).toBe(0);
    });

    it('should find MST for simple graph', () => {
      const { nodes, edges } = createTestGraph();
      const result = kruskalMST(nodes, edges);

      // MST should have n-1 edges
      expect(result.mstEdges.length).toBe(3);

      // Total cost should be sum of smallest edges without cycle
      // Expected: 10 + 15 + 20 = 45
      expect(result.totalCost).toBe(45);
    });

    it('should select edges in ascending weight order', () => {
      const { nodes, edges } = createTestGraph();
      const result = kruskalMST(nodes, edges);

      // First edge should be the one with weight 10
      expect(result.mstEdges[0].weight).toBe(10);
    });

    it('should avoid creating cycles', () => {
      const nodes = [
        { id: 0, x: 0, y: 0 },
        { id: 1, x: 100, y: 0 },
        { id: 2, x: 50, y: 100 }
      ];

      const edges = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 5 },
        { from: 2, to: 0, weight: 5 }
      ];

      const result = kruskalMST(nodes, edges);

      // Should only select 2 edges (n-1) even though all have same weight
      expect(result.mstEdges.length).toBe(2);
      expect(result.totalCost).toBe(10);
    });

    it('should prioritize required edges', () => {
      const { nodes, edges } = createTestGraph();
      
      // Mark the heaviest edge as required
      const modifiedEdges = edges.map(e => 
        (e.from === 3 && e.to === 0) ? { ...e, isRequired: true } : e
      );

      const result = kruskalMST(nodes, modifiedEdges);

      // Required edge should be included even if it's heavy
      const hasRequiredEdge = result.mstEdges.some(e => 
        (e.from === 3 && e.to === 0) || (e.from === 0 && e.to === 3)
      );
      expect(hasRequiredEdge).toBe(true);
    });

    it('should handle graph with custom weights', () => {
      const nodes = [
        { id: 0, x: 0, y: 0 },
        { id: 1, x: 1000, y: 1000 }
      ];

      const edges = [
        { from: 0, to: 1, weight: 5 } // Custom weight overrides distance
      ];

      const result = kruskalMST(nodes, edges);

      expect(result.mstEdges.length).toBe(1);
      expect(result.totalCost).toBe(5);
      expect(result.mstEdges[0].weight).toBe(5);
    });
  });

  describe('Prim MST', () => {
    it('should return empty MST for less than 2 nodes', () => {
      const result = primMST([], []);
      expect(result.mstEdges).toEqual([]);
      expect(result.totalCost).toBe(0);

      const result2 = primMST([{ id: 0 }], []);
      expect(result2.mstEdges).toEqual([]);
      expect(result2.totalCost).toBe(0);
    });

    it('should find MST for simple graph', () => {
      const { nodes, edges } = createTestGraph();
      const result = primMST(nodes, edges);

      // MST should have n-1 edges
      expect(result.mstEdges.length).toBe(3);

      // Total cost should be 45 (same as Kruskal for this graph)
      expect(result.totalCost).toBe(45);
    });

    it('should start from specified node', () => {
      const { nodes, edges } = createTestGraph();
      const result = primMST(nodes, edges, 2); // Start from node 2

      // Should still produce valid MST
      expect(result.mstEdges.length).toBe(3);
      expect(result.totalCost).toBe(45);
    });

    it('should produce same total cost as Kruskal', () => {
      const { nodes, edges } = createTestGraph();
      
      const kruskalResult = kruskalMST(nodes, edges);
      const primResult = primMST(nodes, edges);

      // Both algorithms should find MST with same total cost
      expect(primResult.totalCost).toBe(kruskalResult.totalCost);
    });

    it('should handle disconnected graph gracefully', () => {
      const nodes = [
        { id: 0, x: 0, y: 0 },
        { id: 1, x: 100, y: 0 },
        { id: 2, x: 200, y: 0 },
        { id: 3, x: 300, y: 0 }
      ];

      const edges = [
        { from: 0, to: 1, weight: 10 },
        // Node 2 and 3 are disconnected
      ];

      const result = primMST(nodes, edges);

      // Should only connect the connected component
      expect(result.mstEdges.length).toBeLessThan(3);
    });

    it('should prioritize required edges', () => {
      const { nodes, edges } = createTestGraph();
      
      // Mark an edge as required
      const modifiedEdges = edges.map(e => 
        (e.from === 2 && e.to === 3) ? { ...e, isRequired: true } : e
      );

      const result = primMST(nodes, modifiedEdges);

      // Required edge should be included
      const hasRequiredEdge = result.mstEdges.some(e => 
        e.isRequired === true
      );
      expect(hasRequiredEdge).toBe(true);
    });
  });

  describe('Algorithm Comparison', () => {
    it('should produce equivalent MST cost', () => {
      const { nodes, edges } = createTestGraph();
      
      const kruskalResult = kruskalMST(nodes, edges);
      const primResult = primMST(nodes, edges);

      expect(kruskalResult.totalCost).toBe(primResult.totalCost);
    });

    it('should both handle empty edges', () => {
      const nodes = [
        { id: 0, x: 0, y: 0 },
        { id: 1, x: 100, y: 0 }
      ];

      const kruskalResult = kruskalMST(nodes, []);
      const primResult = primMST(nodes, []);

      expect(kruskalResult.mstEdges.length).toBe(0);
      expect(primResult.mstEdges.length).toBe(0);
    });

    it('should both produce n-1 edges for connected graph', () => {
      const { nodes, edges } = createTestGraph();
      
      const kruskalResult = kruskalMST(nodes, edges);
      const primResult = primMST(nodes, edges);

      expect(kruskalResult.mstEdges.length).toBe(nodes.length - 1);
      expect(primResult.mstEdges.length).toBe(nodes.length - 1);
    });
  });
});
