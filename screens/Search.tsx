import React, { useState } from "react";
import styled from "styled-components/native";
import { moviesApi, tvApi } from "../api";
import { useQuery } from "@tanstack/react-query";
import Hlist from "../components/Hlist";
import Loader from "../components/Loader";

const Container = styled.ScrollView``;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
`;
const Search = () => {
  const [query, setQuery] = useState("");
  const {
    isLoading: moviesLoading,
    data: moviesData,
    refetch: searchMovies,
  } = useQuery({
    queryKey: ["searchMovies", query],
    queryFn: moviesApi.search,
    enabled: false,
  });

  const {
    isLoading: tvLoading,
    data: tvData,
    refetch: searchTv,
  } = useQuery({
    queryKey: ["searchTv", query],
    queryFn: tvApi.search,
    enabled: false,
  });

  const onChangeText = (text: string) => setQuery(text);
  const onSubmit = () => {
    if (query === "") {
      return;
    }
    searchMovies();
    searchTv();
  };

  return (
    <Container>
      <SearchBar
        placeholder="Search for Movie or TV Show"
        placeholderTextColor="grey"
        returnKeyType="search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
      {moviesLoading || tvLoading ? <Loader /> : null}
      {moviesData ? (
        <Hlist title="Movie Results" data={moviesData.results} />
      ) : null}
      {tvData ? <Hlist title="TV Results" data={tvData.results} /> : null}
    </Container>
  );
};

export default Search;
