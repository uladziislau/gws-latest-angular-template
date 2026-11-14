import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SpatialFieldService } from './spatial-field.service';
import { SpatialNode } from '../models/spatial-node.model';

describe('Spatial Signals Laboratory - Mathematical & Reactive Unit Tests', () => {
  let service: SpatialFieldService;

  beforeEach(() => {
    service = new SpatialFieldService();
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  describe('SpatialNode Mathematics', () => {
    it('should calculate Euclidean distance correctly', () => {
      const node = new SpatialNode(1, 100, 100);
      
      // Exact position -> 0
      expect(node.calculateDistance(100, 100)).toBe(0);
      
      // 3-4-5 right triangle (30px horizontal, 40px vertical -> 50px distance)
      expect(node.calculateDistance(130, 140)).toBe(50);
      
      // Negative offset
      expect(node.calculateDistance(70, 60)).toBe(50);
    });

    it('should determine proximity correctly (isNear)', () => {
      const node = new SpatialNode(1, 200, 200);
      
      // Distance 50 (< 80) -> true
      expect(node.isNear(230, 240)).toBe(true);
      
      // Distance 80 (not < 80) -> false
      expect(node.isNear(280, 200)).toBe(false);
      
      // Distance 100 -> false
      expect(node.isNear(300, 200)).toBe(false);
    });

    it('should map color correctly based on distance threshold', () => {
      const node = new SpatialNode(1, 100, 100);
      
      // Distance < 60 -> bright indigo
      expect(node.getColor(130, 100)).toBe('#818cf8');
      
      // Distance between 60 and 120 -> medium indigo
      expect(node.getColor(180, 100)).toBe('#6366f1');
      
      // Distance >= 120 -> zinc neutral
      expect(node.getColor(250, 100)).toBe('#3f3f46');
    });

    it('should map glow shadow correctly', () => {
      const node = new SpatialNode(1, 100, 100);
      
      // Distance < 80 -> glowing shadow
      expect(node.getColor(140, 100)).toContain('#818cf8');
      expect(node.getGlow(140, 100)).toContain('0 0 15px rgba');
      
      // Distance >= 80 -> no glow
      expect(node.getGlow(200, 200)).toBe('none');
    });

    it('should calculate transform correctly based on pause state and distance', () => {
      const node = new SpatialNode(1, 100, 100);
      
      // Distance > 140 -> default transform
      const farTransform = node.getTransform(300, 300, false);
      expect(farTransform).toBe('translate(0px, 0px) scale(1)');

      // Paused -> default transform regardless of distance
      const pausedTransform = node.getTransform(100, 100, true);
      expect(pausedTransform).toBe('translate(0px, 0px) scale(1)');

      // Within 140px -> dynamic magnetic shift and scale
      const nearTransform = node.getTransform(120, 100, false);
      expect(nearTransform).toContain('translate(');
      expect(nearTransform).toContain('scale(');
    });
  });

  describe('SpatialFieldService State & Computed Engine', () => {
    it('should initialize 48 spatial nodes in 1:1 stage coordinates', () => {
      expect(service.nodes.length).toBe(48);
      expect(service.nodes[0].baseX).toBe(75);
      expect(service.nodes[0].baseY).toBe(65);
      expect(service.nodes[47].baseX).toBe(7 * 85 + 75); // Col 7
      expect(service.nodes[47].baseY).toBe(5 * 75 + 65); // Row 5
    });

    it('should update mouse coordinates and calculate closestDistance via computed', () => {
      // Place mouse directly on node 0 (baseX: 75, baseY: 65)
      service.setMousePosition(75, 65);
      expect(service.mouseX()).toBe(75);
      expect(service.mouseY()).toBe(65);
      expect(service.isHovered()).toBe(true);
      expect(service.closestDistance()).toBe(0);

      // Test specific node calculation directly
      const node0 = service.nodes[0];
      const testX = node0.baseX + 30;
      const testY = node0.baseY + 40;
      expect(node0.calculateDistance(testX, testY)).toBe(50);
    });

    it('should ignore mouse position updates when paused', () => {
      service.setMousePosition(100, 100);
      service.togglePause(); // Paused = true
      expect(service.isPaused()).toBe(true);

      service.setMousePosition(200, 200);
      // Mouse position should remain unchanged due to pause guard
      expect(service.mouseX()).toBe(100);
      expect(service.mouseY()).toBe(100);
    });

    it('should toggle mode between grid and constellation', () => {
      expect(service.mode()).toBe('grid');
      service.setMode('constellation');
      expect(service.mode()).toBe('constellation');
      service.setMode('grid');
      expect(service.mode()).toBe('grid');
    });
  });
});
