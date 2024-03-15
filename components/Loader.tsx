import { View, Text, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import React from "react";

const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Loader = () => {
  return (
    <Wrapper>
      <ActivityIndicator />
    </Wrapper>
  );
};

export default Loader;
