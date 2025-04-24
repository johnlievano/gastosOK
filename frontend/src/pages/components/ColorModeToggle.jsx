import React from "react"
import { IconButton, useColorMode} from "@chakra-ui/react"

const ColorModeToggle = () => {
    const { ColorMode, toggleColorMode } = useColorMode();

    return(
        <IconButton 
            aria-label="Cambiar tema"
            onClick={toggleColorMode}
            position="fixed"      
            top="1rem"
            right="1rem"
            size="lg"
            variant="ghost"
        />
    );
}

export default ColorModeToggle;