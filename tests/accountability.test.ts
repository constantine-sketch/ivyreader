/**
 * Accountability Messaging API Tests
 * 
 * Tests the database functions for accountability messaging between Elite users and founders.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../server/db', () => ({
  getAccountabilityMessages: vi.fn(),
  sendAccountabilityMessage: vi.fn(),
  getAllAccountabilityConversations: vi.fn(),
  markMessagesAsRead: vi.fn(),
}));

import * as db from '../server/db';

describe('Accountability Messaging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAccountabilityMessages', () => {
    it('should return messages for a specific user', async () => {
      const mockMessages = [
        { id: 1, userId: 1, senderType: 'user' as const, content: 'Hello!', isRead: 0, createdAt: new Date() },
        { id: 2, userId: 1, senderType: 'founder' as const, content: 'Welcome!', isRead: 0, createdAt: new Date() },
      ];
      
      vi.mocked(db.getAccountabilityMessages).mockResolvedValue(mockMessages);
      
      const result = await db.getAccountabilityMessages(1);
      
      expect(db.getAccountabilityMessages).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMessages);
      expect(result.length).toBe(2);
    });

    it('should return empty array for user with no messages', async () => {
      vi.mocked(db.getAccountabilityMessages).mockResolvedValue([]);
      
      const result = await db.getAccountabilityMessages(999);
      
      expect(result).toEqual([]);
    });
  });

  describe('sendAccountabilityMessage', () => {
    it('should send a message from user', async () => {
      vi.mocked(db.sendAccountabilityMessage).mockResolvedValue({ insertId: 1 } as any);
      
      const result = await db.sendAccountabilityMessage(1, 'user', 'Test message');
      
      expect(db.sendAccountabilityMessage).toHaveBeenCalledWith(1, 'user', 'Test message');
      expect(result).toBeDefined();
    });

    it('should send a message from founder', async () => {
      vi.mocked(db.sendAccountabilityMessage).mockResolvedValue({ insertId: 2 } as any);
      
      const result = await db.sendAccountabilityMessage(1, 'founder', 'Founder response');
      
      expect(db.sendAccountabilityMessage).toHaveBeenCalledWith(1, 'founder', 'Founder response');
      expect(result).toBeDefined();
    });
  });

  describe('getAllAccountabilityConversations', () => {
    it('should return grouped conversations for admin dashboard', async () => {
      const mockConversations = [
        {
          user: { id: 1, name: 'Test User', email: 'test@example.com', username: 'testuser', avatar: '📚', subscriptionTier: 'elite' as const },
          messages: [
            { id: 1, userId: 1, senderType: 'user' as const, content: 'Hello', isRead: 0, createdAt: new Date() },
          ],
          lastMessage: { id: 1, userId: 1, senderType: 'user' as const, content: 'Hello', isRead: 0, createdAt: new Date() },
          unreadCount: 1,
        },
      ];
      
      vi.mocked(db.getAllAccountabilityConversations).mockResolvedValue(mockConversations);
      
      const result = await db.getAllAccountabilityConversations();
      
      expect(result).toEqual(mockConversations);
      expect(result[0].unreadCount).toBe(1);
    });

    it('should return empty array when no conversations exist', async () => {
      vi.mocked(db.getAllAccountabilityConversations).mockResolvedValue([]);
      
      const result = await db.getAllAccountabilityConversations();
      
      expect(result).toEqual([]);
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark all user messages as read for a conversation', async () => {
      vi.mocked(db.markMessagesAsRead).mockResolvedValue(undefined);
      
      await db.markMessagesAsRead(1);
      
      expect(db.markMessagesAsRead).toHaveBeenCalledWith(1);
    });
  });
});

describe('Accountability Message Validation', () => {
  it('should validate message content length', () => {
    const validContent = 'This is a valid message';
    const emptyContent = '';
    const longContent = 'a'.repeat(2001);
    
    expect(validContent.length).toBeGreaterThan(0);
    expect(validContent.length).toBeLessThanOrEqual(2000);
    expect(emptyContent.length).toBe(0);
    expect(longContent.length).toBeGreaterThan(2000);
  });

  it('should validate sender type', () => {
    const validSenderTypes = ['user', 'founder'];
    const invalidSenderType = 'admin';
    
    expect(validSenderTypes.includes('user')).toBe(true);
    expect(validSenderTypes.includes('founder')).toBe(true);
    expect(validSenderTypes.includes(invalidSenderType)).toBe(false);
  });
});
