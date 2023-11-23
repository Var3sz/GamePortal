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
                    backgroundColor: "var(--chakra-colors-primary)",
                    borderColor: "transparent",
                    color: "var(--chakra-colors-secondary)",
                    _hover: {
                        backgroundColor: '#5d7d4f'
                    }
                },
                authButton: {
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "var(--chakra-colors-primary)",
                    borderColor: "transparent",
                    color: "var(--chakra-colors-secondary)",
                    _hover: {
                        backgroundColor: '#5d7d4f'
                    },
                    width: "100%"
                },
                unauthorizedButton: {
                    mt:'10px',
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "var(--chakra-colors-primary)",
                    textAlign: 'center',
                    borderColor: "transparent",
                    color: "var(--chakra-colors-secondary)",
                    _hover: {
                        backgroundColor: '#5d7d4f'
                    },
                    width: "50%"
                }
            }
        },
        Card: {
            variants: {
                gameCard: {
                    container: {
                        width: "21rem",
                        borderRadius: "10px",
                        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)"
                    }
                },
                loginCard: {
                    container: {
                        display: 'flex',
                        justifyContent: 'center',
                        width: "32rem",
                        borderRadius: "10px",
                        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
                        mt: '40px',
                        p: "20px"
                    }
                },
                unauthorizedCard: {
                    container: {
                        display: 'flex',
                        justifyContent: 'center',
                        width: "35rem",
                        mt: '50px',
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
                },
                authTitle: {
                    mt: '10px',
                    mb: '0px',
                    textAlign: "center"
                }
            }
        }
    }
});

export default customTheme;