import React from "react";
import { View, Text, Pressable } from "react-native";
import { AlertTriangle, RefreshCw } from "lucide-react-native";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary — catches JS errors in the component tree and
 * shows a recovery UI. Class component is required (no hooks equivalent).
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-surface items-center justify-center px-8">
          <View className="w-16 h-16 rounded-2xl bg-secondary/10 items-center justify-center mb-5">
            <AlertTriangle color="#a03f29" size={32} />
          </View>
          <Text className="font-manrope text-2xl font-bold text-on-surface text-center mb-2">
            Something went wrong
          </Text>
          <Text className="font-inter text-sm text-on-surface-variant text-center mb-2 leading-relaxed">
            The app ran into an unexpected error. This has been logged and we
            are working on a fix.
          </Text>
          {__DEV__ && this.state.error && (
            <Text className="font-inter text-xs text-outline text-center mb-6 max-w-[90%]">
              {this.state.error.message}
            </Text>
          )}
          <Pressable
            onPress={this.handleReset}
            className="bg-primary px-8 py-4 rounded-full flex-row items-center gap-2 active:opacity-90"
          >
            <RefreshCw color="#ffffff" size={18} />
            <Text className="font-manrope font-bold text-lg text-white">
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
