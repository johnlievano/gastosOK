import { useState, useEffect } from 'react';
import { Button } from "@chakra-ui/react"
import { SiGodotengine } from 'react-icons/si';
import { FaReact } from 'react-icons/fa';
import { SiDjango } from 'react-icons/si';
import { SiRust } from "react-icons/si";
import { SiVite } from "react-icons/si";
import { FaPython } from 'react-icons/fa';
import { FaGitAlt } from 'react-icons/fa';
import { FaLinux } from 'react-icons/fa';
import { FaLink } from "react-icons/fa6";

import { FaHtml5 } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa";
import { SiJavascript } from "react-icons/si";

import { FiTerminal } from 'react-icons/fi';
import { GiRabbit } from 'react-icons/gi';

import { FiKey } from 'react-icons/fi';
import { GiGamepad } from 'react-icons/gi';
import { LuFlower2 } from "react-icons/lu";

import { FiHome } from 'react-icons/fi';
import { FaRegBuilding } from "react-icons/fa";
import { FiPackage } from 'react-icons/fi';
import { FiShield } from 'react-icons/fi'

import { FiCpu } from 'react-icons/fi';
import { FiLayout } from 'react-icons/fi';
import { FiGlobe } from 'react-icons/fi';

import { RiNextjsFill } from "react-icons/ri";

import { FiFileText } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { IoShieldCheckmark } from "react-icons/io5";
import { IoLanguageSharp } from "react-icons/io5";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { GrProjects } from "react-icons/gr";
import { FiPlus } from "react-icons/fi";

// Mapeo de nombres de iconos a componentes
const icons = {
    SiGodotengine,
    FaReact,
    SiDjango,
    FaPython,
    FaGitAlt,
    FaLinux,
    FiTerminal,
    GiRabbit,
    FiKey,
    GiGamepad,
    FiHome,
    FiPackage,
    FiShield,
    FiCpu,
    FiLayout,
    FiGlobe,
    SiVite,
    SiRust,
    RiNextjsFill,
    FaHtml5,
    FaCss3Alt,
    SiJavascript,
    FaRegBuilding,
    LuFlower2,
    FiFileText,
    FaGithub,
    FaLinkedin,
    CiMail,
    FiMapPin,
    FaLink,
    IoShieldCheckmark,
    IoLanguageSharp,
    IoSunny,
    FaMoon,
    GrServices,
    GrProjects,
    FiPlus
};


export default function Buttom({text,icon,size,color,variant}){
    const IconComponent = icons[icon];
    return(
        <Button size={size} colorPalette={color} variant={variant}><IconComponent />{text}</Button>
    );  
}