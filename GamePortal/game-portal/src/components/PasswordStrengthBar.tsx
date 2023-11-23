import {
  Box,
  Progress,
  ProgressProps,
  Text,
  ThemingProps,
} from "@chakra-ui/react";
import { useMemo } from "react";

/**
 * 2023-as Alkalmazásfejlesztési környezetek házi feladatban
 * készítettük ez a StrengthBar-t, 
 */

interface Props extends Omit<ProgressProps, "value" | "colorScheme"> {
  password: string | undefined;
}

export function PasswordStrengthBar({ password = "", ...props }: Props) {
  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(password);
  }, [password]);

  return (
    <Box>
      <Progress
        value={passwordStrength.value}
        colorScheme={passwordStrength.color}
        borderRadius="full"
        {...props}
      />
      <Text color={passwordStrength.color}>{passwordStrength.text}</Text>
    </Box>
  );
}

type PasswordStrengthValues = {
  color: ThemingProps["colorScheme"];
  value: number;
  text: string;
};

const passwordStrengthValues: Record<
  "strong" | "moderate" | "weak",
  PasswordStrengthValues
> = {
  strong: { color: "green", value: 100, text: "Strong" },
  moderate: {
    color: "orange",
    value: 50,
    text: "Moderate",
  },
  weak: { color: "red", value: 10, text: "Weak" },
};

function calculatePasswordStrength(password: string): PasswordStrengthValues {
  const lengthWeight = 0.5;
  const uppercaseWeight = 1;
  const lowercaseWeight = 1;
  const digitWeight = 1.5;
  const specialCharWeight = 2;

  let strength = 0;

  strength += lengthWeight * password.length;

  if (/[A-Z]/.test(password)) {
    strength += uppercaseWeight;
  }

  if (/[a-z]/.test(password)) {
    strength += lowercaseWeight;
  }

  if (/[0-9]/.test(password)) {
    strength += digitWeight;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    strength += specialCharWeight;
  }

  if (strength >= 10) {
    return passwordStrengthValues.strong;
  } else if (strength >= 5) {
    return passwordStrengthValues.moderate;
  } else {
    return passwordStrengthValues.weak;
  }
}