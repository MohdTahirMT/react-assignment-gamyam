import { useState, useEffect } from "react";
import { Center, Grid, Image } from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { CarouselCard } from "../Components/CarouselCard";
import loader from "../assets/loader.gif";

const ListOfLands = () => {
  const [items, setItems] = useState([]); // State to hold fetched data
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to hold error
  const [page, setPage] = useState(1); // State to hold page

  // Function to fetch data from the API
  const fetchData = async () => {
    setIsLoading(true); // Set loading state to true
    setError(null); // Reset error state

    try {
      // Fetch data from the API
      const response = await axios.get(
        `https://prod-be.1acre.in/lands/?ordering=-updated_at&page=${page}&page_size=10`
      );
      const data = response.data?.results;

      // Update state with new data
      setItems((prevItems) => [...prevItems, ...data]);

      // Incresing page
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      // Set error state if there's an error during fetching
      setError(error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  };

  // useEffect to fetch data when component mounts
  useEffect(() => {
    fetchData(); // Initial fetch when component mounts
  }, []);

  return (
    <>
      {/* InfiniteScroll component to handle infinite scrolling */}
      <InfiniteScroll
        dataLength={items.length} // Length of data array
        next={fetchData} // Function to call for fetching more data
        hasMore={true} // Flag to indicate if there's more data to load
        loader={
          isLoading && ( // Loader to display when loading
            <Center style={{ paddingBlock: 20 }}>
              <Image src={loader} height={75} width={75} fit="cover" />
            </Center>
          )
        }
      >
        {/* Grid to display fetched data */}
        <Grid style={{ paddingInline: "7%", paddingBlock: "2%" }}>
          {items?.map((land) => (
            <Grid.Col key={land?.id} span={{ xs: 12, sm: 6, md: 4 }}>
              {/* Render CarouselCard for each land */}
              <CarouselCard data={land} />
            </Grid.Col>
          ))}
        </Grid>
      </InfiniteScroll>
      {/* Display error message if there's an error */}
      {error && <p>Error: {error.message}</p>}
    </>
  );
};

export default ListOfLands;
