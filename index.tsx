// Importing React and necessary components from React Native
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import axios from "axios"; // Importing axios for making API requests

const quoteApi = 'https://zenquotes.io/api/random';
const pexelsApiKey = 'YOUR-KEY';

// Defining the quote type
type Quote = {
  q: string; // quote text
  a: string; // quote author
};

export default function Index() {
  const [quote, setQuote] = useState<Quote | null>(null); // State to hold the quote
  const [loading, setLoading] = useState(true); // State for managing the loading status
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State to hold the author's image URL

  // Function to fetch the quote from ZenQuotes API
  const fetchQuote = async () => {
    try {
      setLoading(true); // Indicate that loading is in progress
      const response = await fetch(quoteApi);
      const data = await response.json();
      const fetchedQuote = data[0]; // Save the first quote from the array
      setQuote(fetchedQuote); // Update the quote state
      fetchAuthorImage(fetchedQuote.a); // Fetch the author's image using their name
    } catch (error) {
      console.error('Error connecting to the API:', error);
    } finally {
      setLoading(false); // Loading is finished
    }
  };

  // Function to search for the author's image using Pexels API
  const fetchAuthorImage = async (author: string) => {
    try {
      const response = await axios.get(`https://api.pexels.com/v1/search`, {
        headers: {
          Authorization: pexelsApiKey,
        },
        params: {
          query: author, // Use the author's name as the search query
          per_page: 1, // Request only one image
        },
      });

      if (response.data.photos.length > 0) {
        setImageUrl(response.data.photos[0].src.medium); // Save the image URL
      } else {
        setImageUrl(null); // If no image is found, set to null
      }
    } catch (error) {
      console.error('Error fetching author image:', error);
      setImageUrl(null); // Handle the error by setting imageUrl to null
    }
  };

  useEffect(() => {
    fetchQuote(); // Fetch the quote when the component mounts
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quotes</Text>

      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.authorImage} 
          resizeMode="contain"
        />
      )}

      <View style={styles.quoteContainer}>
        {/* Show a loading indicator while the quote is being fetched */}
        {loading ? (
          <Text>Loading quote...</Text>
        ) : (
          <>
            <Text style={styles.quoteText}>"{quote?.q}"</Text>
            <Text style={styles.authorText}>- {quote?.a}</Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Get new quote!"
          color="#841584"
          onPress={fetchQuote} 
        />
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  quoteContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 18,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  authorText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 10,
  },
  authorImage: {
    width: 300, // Make the image larger
    height: 200,
    borderRadius: 70, // No border radius to keep the image square
    marginBottom: 20, // Adjust the margin below the image
  },
  buttonContainer: {
    width: "80%",
  },
});
