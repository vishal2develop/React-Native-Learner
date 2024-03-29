import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { Movie, MovieDetails, moviesApi, TV, TVDetails, tvApi } from "../api";
import Poster from "../components/Poster";
import { Dimensions, StyleSheet, Share, Platform } from "react-native";
import { makeImagePath } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { BLACK_COLOR, WHITE_COLOR, YELLOW_COLOR } from "../constants/colors";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

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

const Data = styled.View`
  padding: 0px 20px;
`;

const Overview = styled.Text`
  color: ${(props) => props.theme.textColor};
  margin-top: 20px;
  padding: 0px 20px;
`;

const VideoBtn = styled.TouchableOpacity`
  flex-direction: row;
`;
const BtnText = styled.Text`
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 24px;
  margin-left: 10px;
`;

type RootStackParamList = {
  Detail: Movie | TV;
};

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, "Detail">;

const Detail: React.FC<DetailScreenProps> = ({
  navigation: { setOptions },
  route: { params },
}) => {
  const ShareButton = () => {
    const isDark = useColorScheme() === "dark";

    return (
      <TouchableOpacity onPress={shareMedia}>
        <Ionicons
          name="share-outline"
          color={isDark ? YELLOW_COLOR : BLACK_COLOR}
          size={24}
        />
      </TouchableOpacity>
    );
  };
  const isMovie = "original_title" in params;

  const { isLoading, data } = useQuery<MovieDetails | TVDetails>({
    queryKey: [isMovie ? "movies" : "tv", params.id],
    queryFn: isMovie ? moviesApi.detail : tvApi.detail,
  });

  const shareMedia = async () => {
    if (data) {
      const isAndroid = Platform.OS === "android";
      const homepage =
        isMovie && "imdb_id" in data
          ? `https://www.imdb.com/title/${data.imdb_id}/`
          : data.homepage;
      if (isAndroid) {
        await Share.share({
          message: `${params.overview}\nCheck it out: ${homepage}`,
          title:
            "original_title" in params
              ? params.original_title
              : params.original_name,
        });
      } else {
        await Share.share({
          url: homepage,
          title:
            "original_title" in params
              ? params.original_title
              : params.original_name,
        });
      }
    }
  };

  useEffect(() => {
    setOptions({
      title: "original_title" in params ? "Movie" : "TV Show",
    });
  }, []);

  useEffect(() => {
    if (data) {
      setOptions({
        headerRight: () => <ShareButton />,
      });
    }
  }, [data]);

  const openYTLink = async (videoID: string) => {
    const baseUrl = `https://m.youtube.com/watch?v=${videoID}`;
    // await Linking.openURL(baseUrl);
    await WebBrowser.openBrowserAsync(baseUrl);
  };

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
      <Data>
        <Overview>{params.overview}</Overview>
        {isLoading ? <Loader /> : null}
        {data?.videos?.results?.map((video) =>
          video.site === "YouTube" ? (
            <VideoBtn key={video.key} onPress={() => openYTLink(video.key)}>
              <Ionicons name="logo-youtube" color="white" size={24} />
              <BtnText>{video.name}</BtnText>
            </VideoBtn>
          ) : null
        )}
      </Data>
      {/* <Overview>{params.overview}</Overview> */}
    </Container>
  );
};

export default Detail;
