import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "./context/ThemeContext";
import { lightColors } from "../constants/colors";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
    const { colors } = useTheme();
    const styles = React.useMemo(() => createStyles(colors), [colors]);
    return (
        <>
            <Stack.Screen options={{ title: "404 - Not Found" }} />
            <View style={styles.container}>
                <Link href="/" style={styles.button}>
                    Go back to Home screen!
                </Link>
            </View>
        </>
    );
}

const createStyles = (c: typeof lightColors) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: c.offWhite,
    },
    text: {
        fontSize: 30,
        color: c.textPrimary,
    },
    button: {
        backgroundColor: c.success,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: c.textPrimary,
        fontWeight: "bold",
    },
});
