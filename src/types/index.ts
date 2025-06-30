
export interface FullMessage {
    id: string;
    language: string;
    message1: string;
    message2: string;
    message3: string;
    chatButton: {
      buttonLabel: string;
      buttonIcon: string;
    }
    isActive: boolean;
}