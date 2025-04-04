import React from 'react';
import { View, Text } from 'react-native';
import { cssInterop } from 'nativewind';

// Use cssInterop to ensure components work with className
const StyledView = cssInterop(View, { className: 'style' });
const StyledText = cssInterop(Text, { className: 'style' });

export default function StyledExample() {
  return (
    <StyledView className="w-full mt-4">
      <StyledText className="text-lg font-bold mb-2">Styled API Example</StyledText>
      
      <StyledView className="bg-purple-500 p-4 rounded-lg mb-4">
        <StyledText className="text-white font-bold">This is a purple box</StyledText>
      </StyledView>
      
      <StyledView className="bg-teal-500 p-4 rounded-lg mb-4">
        <StyledText className="text-white font-bold">This is a teal box</StyledText>
      </StyledView>
      
      <StyledView className="bg-amber-500 p-4 rounded-lg mb-4">
        <StyledText className="text-white font-bold">This is an amber box</StyledText>
      </StyledView>
    </StyledView>
  );
} 