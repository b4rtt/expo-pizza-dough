import { Text, TextProps } from 'react-native';

import { useThemeColors } from '@/providers/ThemeProvider';
import { typography } from '@/constants/theme';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'label' | 'button';

type Props = TextProps & {
  variant?: Variant;
  color?: string;
};

const baseStyles: Record<Variant, { fontFamily: string; fontSize: number; lineHeight: number; letterSpacing?: number }> = {
  display: { fontFamily: typography.display, fontSize: 32, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: typography.heading, fontSize: 20, lineHeight: 28, letterSpacing: -0.2 },
  subtitle: { fontFamily: typography.subheading, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: typography.body, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: typography.medium, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: typography.bold, fontSize: 15, lineHeight: 20, letterSpacing: -0.1 },
};

export function Typography({ variant = 'body', color, style, children, ...rest }: Props) {
  const { colors } = useThemeColors();
  const base = baseStyles[variant];
  return (
    <Text
      {...rest}
      style={[
        {
          color: color ?? colors.text,
          ...base,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}
