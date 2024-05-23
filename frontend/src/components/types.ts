// Export all interfaces from this file

export interface ThemeProps {
    themeType: 'select' | 'toggle',
    theme: string,
    setTheme: (theme: string) => void
}

export interface ThemeChildProps {
    theme: string
    setTheme: (theme: string) => void
}

export interface BodyProps {
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    setUsername: (username: string) => void;
    socket: any;
    username: string;
    setUserId: (userId: string) => void;
    userId: string;
    messages: any;
    setMessages: (messages: any) => void;
}

export interface WelcomeProps {
    setLoggedIn: (loggedIn: boolean) => void;
    setUsername: (username: string) => void;
    socket: any;
    setUserId: (userId: string) => void;
    setMessages: (messages: any) => void;
}

export interface ChatProps {
    socket: any;
    username: string;
    userId: string;
    messages: any;
  }

export interface LoginProps {
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
}

export interface HeaderProps {
    theme: string;
    setTheme: (theme: string) => void;
    loggedIn: boolean;
    username: string;
    setLoggedIn: (loggedIn: boolean) => void;
  }

export interface LoginInputProps {
    loginUser : () => void;
    name: string;
    setName: (name: string) => void;
}

export interface BubbleProps {
    message: any;
    userId: string;
    showMessageOptions: {show: boolean, id: string};
    editMessage: (messageId: string, message: string) => void;
    handleDeleteMessage: (messageId: string) => void;
    handleMessageClick: (messageId: string) => void;
}