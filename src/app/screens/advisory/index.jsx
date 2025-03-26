import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Button, Alert, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../../component/Header';

const AdvisoryScreen = () => {
    const [pdfUri, setPdfUri] = useState(null);
    const [loading, setLoading] = useState(false);

    const folderId = '1wv2yWLh6vZncwS-rEGX2-31VTG9LHnrt';
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

    useEffect(() => {
        fetchLatestPdf();
    }, []);

    const fetchLatestPdf = async () => {
        if (!apiKey) {
            Alert.alert('Error', 'API Key is missing.');
            return;
        }

        try {
            setLoading(true);

            const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&orderBy=modifiedTime%20desc&fields=files(id,name,mimeType)&key=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.files && data.files.length > 0) {
                const latestFile = data.files[0];

                if (latestFile.mimeType !== 'application/pdf') {
                    Alert.alert('Error', 'The latest file is not a PDF.');
                    setLoading(false);
                    return;
                }

                // ✅ Use Google Drive's built-in PDF Viewer
                const viewUrl = `https://drive.google.com/file/d/${latestFile.id}/preview`;

                setPdfUri(viewUrl);
            } else {
                Alert.alert('No PDF found in the folder');
            }
        } catch (error) {
            console.error('Error fetching PDF:', error);
            Alert.alert('Error', 'Failed to fetch PDF. Check API Key and permissions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1,}}>
            <Header/>
        <View style={{ flex: 1, padding:10 }}>
            {loading ? (
                <ActivityIndicator size="large" style={{ flex: 1 }} />
            ) : pdfUri ? (
                <WebView source={{ uri: pdfUri }} style={{ flex: 1 }} />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button title="Retry Fetching PDF" onPress={fetchLatestPdf} />
                </View>
            )}
        </View>
        </SafeAreaView>
    );
};

export default AdvisoryScreen;
