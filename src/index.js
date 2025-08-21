import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const DetectObject = () => {
    const [imageUri, setImageUri] = useState(null);
    const [labels, setLabels] = useState([]);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
                
            }   
        } catch (error) {
            console.error("Error picking image: ", error);
        }
    };

    const analyzeImage = async () => {
        try {
            if(!imageUri) {
                alert("Please select an image first.");
                return;
            }

            //
            const apiKey = "AIzaSyA7_4EyA74doaRTVWPztOSqOouOw_4JRSk"; 
            const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

            const base64Image = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const requestData = {
                requests: [
                    {
                        image: {
                            content: base64Image,
                        },
                        features: [
                            {
                                type: "LABEL_DETECTION",
                                maxResults: 5,
                            },
                        ],
                    },
                ],
            };
            const response = await axios.post(apiURL, requestData);
            const labels = response.data.responses[0].labelAnnotations;
            setLabels(labels);
        } 
        catch (error) {
                console.error("Error analyzing image: ", error);
                alert("Failed to analyze image. Please try again.");
        }
    };

  return (
    <View style={styles.container}> 
        <Text style={styles.title}>
            Google Cloud Vision API Demo
        </Text>
        {imageUri && (
            <Image
                source={{ uri: imageUri }}
                style={{ width: 300, height: 300 }}
            />
        )}
        <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text style = {styles.text}>Pick an Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={analyzeImage} style={styles.button}>
            <Text style = {styles.text}>Analyze Image</Text>
        </TouchableOpacity>
        {
            labels.length > 0 && (
                <View>
                    <Text style={styles.title}>
                        Labels:
                    </Text>
                    {
                        labels.map((label) => (
                            <Text
                                key={label.mid}
                                style={styles.outputtext}
                            >
                                {label.description}
                            </Text>
                        ))
                    }
                </View>   
            )
        }
    </View>
  );
};

export default DetectObject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: 20
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  outputtext: {
    fontSize: 18,
    marginBottom:20,
  }
});
