import React, { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { parsePhoneNumberWithError, formatNumber } from "libphonenumber-js";

type InputBoxProps = {
  input: string;
  name: string;
  longText?: boolean;
  required?: boolean;
  placeholder?: string;
  validationRegex?: string;
  errorMessage?: string;
  phoneNumber?: boolean;
};

const validate = (
  value: string,
  validationRegex: string,
  errorMessage: string
) => {
  const regex = new RegExp(validationRegex);
  return regex.test(value) ? undefined : errorMessage;
};

const InputBox = ({
  input,
  name,
  longText = false,
  required = false,
  placeholder = "",
  validationRegex = "",
  errorMessage = "",
  phoneNumber = false,
}: InputBoxProps) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | undefined>("");

  const handlePhoneChange = (text: string) => {
    try {
      const parsed = parsePhoneNumberWithError(text, "US");
      setPhone(parsed ? formatNumber(parsed.number, "INTERNATIONAL") : text);
      setError("");
    } catch (err) {
      setPhone(text);
      setError(errorMessage);
    }
  };

  return (
    <View className="w-full mb-3">
      {phoneNumber ? (
        <View>
          <TextInput
            className="w-full border-2 rounded-lg p-3 text-base text-white border-yellow-700"
            onChangeText={handlePhoneChange}
            value={phone}
            placeholder={placeholder}
            keyboardType="phone-pad"
          />
          {error ? <Text className="text-red-500 text-sm mt-1">{error}</Text> : null}
        </View>
      ) : (
        <View>
          <TextInput
            className={`w-full border-2 rounded-lg p-3 text-base text-white border-yellow-700 ${longText ? "h-32" : "h-12"}`}
            placeholder={placeholder}
            multiline={longText}
          />
        </View>
      )}
    </View>
  );
};

export default InputBox;