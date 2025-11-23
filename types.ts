import React from 'react';

export enum MessageRole {
    USER = 'user',
    MODEL = 'model'
}

export interface ChatMessage {
    id: string;
    role: MessageRole;
    text: string;
    timestamp: number;
    type?: 'text' | 'code-review' | 'doc-generation';
}

export interface RuleSection {
    id: string;
    title: string;
    icon: React.ElementType;
    content: string;
    items: string[];
}

export interface ToolConfig {
    mode: 'general' | 'review' | 'docs';
    systemPrompt: string;
}