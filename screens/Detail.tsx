import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text } from "react-native";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { Movie, moviesApi, TV, tvApi } from "../api";
import Poster from "../components/Poster";
import { Dimensions, StyleSheet } from "react-native";
import { makeImagePath } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { BLACK_COLOR } from "../constants/colors";
import { useQuery } from "@tanstack/react-query";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Header = styled.View`
  height: ${SCREEN_HEIGHT / 4}px;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const Background = styled.Image``;

const Column = styled.View`
  flex-direction: row;
  width: 80%;
`;
const Title = styled.Text`
  color: white;
  font-size: 36px;
  align-self: flex-end;
  margin-left: 15px;
  font-weight: 500;
`;
const Overview = styled.Text`
  color: ${(props) => props.theme.textColor};
  margin-top: 20px;
  padding: 0px 20px;
`;

type RootStackParamList = {
  Detail: Movie | TV;
};

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, "Detail">;

const Detail: React.FC<DetailScreenProps> = ({
  navigation: { setOptions },
  route: { params },
}) => {
  const { isLoading: moviesLoading, data: moviesData } = useQuery({
    queryKey: ["movies", params.id],
    queryFn: moviesApi.detail,
    enabled: "original_title" in params,
  });

  const { isLoading: tvLoading, data: tvData } = useQuery({
    queryKey: ["tv", params.id],
    queryFn: tvApi.detail,
    enabled: "original_name" in params,
  });
  console.log("movies", moviesData);
  console.log("tv", tvData);

  useEffect(() => {
    setOptions({
      title: "original_title" in params ? "Movie" : "TV Show",
    });
  }, []);

  return (
    <Container>
      <Header>
        <Background
          style={StyleSheet.absoluteFill}
          source={{ uri: makeImagePath(params.backdrop_path || "") }}
        />
        <LinearGradient
          colors={["transparent", BLACK_COLOR]}
          style={StyleSheet.absoluteFill}
        />
        <Column>
          <Poster path={params.poster_path || ""} />
          <Title>
            {"original_title" in params
              ? params.original_title
              : params.original_name}
          </Title>
        </Column>
      </Header>
      <Overview>{params.overview}</Overview>
    </Container>
  );
};

export default Detail;
