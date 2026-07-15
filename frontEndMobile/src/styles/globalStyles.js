const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,      // ← vient de colors.js
        paddingHorizontal: Spacing.screenPadding, // ← vient de spacing.js
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Spacing.cardRadius,
        padding: Spacing.md,
    },
});