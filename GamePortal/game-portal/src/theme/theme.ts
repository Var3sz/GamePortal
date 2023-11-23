import { extendTheme } from "@chakra-ui/react";

export const customColors = {
    primary: "#769656",
    secondary: "#ffffff",
    black: "#000000"
};

const customTheme = extendTheme({
    colors: customColors,
    components: {
        Button: {
            variants: {
                gameButton: {
                    fontSize: "15px", 
                    fontWeight: "bold",
                    backgroundColor: "var(--chakra-colors-primary) !important", 
                    borderColor: "transparent !important",
                    color: "var(--chakra-colors-secondary) !important",
                }
            }
        },
        Card: {
            variants: {
                gameCard: {
                    container: {
                        width: "21rem",
                        borderRadius: "10px",
                        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
                    }
                }
            }
        },
        Heading: {
            variants: {
                gameTitle: {
                    textAlign: "center"
                }
            }
        }
    }
});

export default customTheme;