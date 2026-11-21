
package com.example.chatbot;

import org.springframework.stereotype.Service;
import java.util.Locale;

@Service
public class FAQService {

    public String getAnswer(String message) {

        String question = message.toLowerCase(Locale.ROOT).trim();

        // Greetings
        if (question.matches(".*\\b(hello|hi|hey|namaste)\\b.*")) {
            return "Hello! Welcome to Nova AI. I am your smart "
                    + "computer science assistant. How can I help you today?";
        }

        // JavaScript (Check before Java)
        if (question.contains("javascript")) {
            return "JavaScript is a programming language used to make "
                    + "websites interactive and dynamic. It is commonly "
                    + "used in frontend and backend development.";
        }

        // MySQL (Check before SQL)
        if (question.contains("mysql")) {
            return "MySQL is an open-source relational database "
                    + "management system. It uses SQL to store and "
                    + "manage structured data.";
        }

        // Machine Learning
        if (question.contains("machine learning")
                || question.matches(".*\\bml\\b.*")) {
            return "Machine Learning is a branch of Artificial Intelligence "
                    + "that enables computers to learn patterns from data "
                    + "and make predictions without being explicitly "
                    + "programmed for every task.";
        }

        // Artificial Intelligence
        if (question.contains("artificial intelligence")
                || question.matches(".*\\bai\\b.*")) {
            return "Artificial Intelligence (AI) is a branch of computer "
                    + "science that enables machines to perform tasks "
                    + "that normally require human intelligence.";
        }

        // Java
        if (question.matches(".*\\bjava\\b.*")) {
            return "Java is a high-level, object-oriented programming "
                    + "language. It is used to build desktop, web, "
                    + "mobile and enterprise applications.";
        }

        // Python
        if (question.contains("python")) {
            return "Python is a beginner-friendly, high-level programming "
                    + "language. It is widely used in AI, data science, "
                    + "automation and web development.";
        }

        // C Programming
        if (question.matches(".*\\bc language\\b.*")
                || question.matches(".*\\bc programming\\b.*")) {
            return "C is a general-purpose procedural programming language "
                    + "used in system programming, operating systems "
                    + "and embedded applications.";
        }

        // C++
        if (question.contains("c++")
                || question.contains("cpp")) {
            return "C++ is a general-purpose programming language "
                    + "that supports procedural and object-oriented "
                    + "programming. It is widely used in software "
                    + "development and game programming.";
        }

        // HTML
        if (question.contains("html")) {
            return "HTML stands for HyperText Markup Language. "
                    + "It defines the structure and content of web pages.";
        }

        // CSS
        if (question.matches(".*\\bcss\\b.*")) {
            return "CSS stands for Cascading Style Sheets. "
                    + "It controls the design, colors, layout and "
                    + "appearance of web pages.";
        }

        // DBMS
        if (question.contains("dbms")) {
            return "DBMS stands for Database Management System. "
                    + "It is software used to store, organize, "
                    + "manage and retrieve data efficiently.";
        }

        // SQL
        if (question.matches(".*\\bsql\\b.*")) {
            return "SQL stands for Structured Query Language. "
                    + "It is used to create, retrieve, update "
                    + "and delete data in relational databases.";
        }

        // Operating System
        if (question.contains("operating system")
                || question.matches(".*\\bos\\b.*")) {
            return "An Operating System is system software that manages "
                    + "computer hardware, memory, files and applications. "
                    + "Examples include Windows, Linux and macOS.";
        }

        // Computer Basics
        if (question.contains("computer")) {
            return "A computer is an electronic device that accepts data, "
                    + "processes it according to instructions and "
                    + "produces useful information.";
        }

        // Data Structures
        if (question.contains("data structure")) {
            return "A Data Structure is a way of organizing and storing "
                    + "data so it can be accessed and modified efficiently.";
        }

        // Stack
        if (question.matches(".*\\bstack\\b.*")) {
            return "A Stack is a linear data structure that follows "
                    + "LIFO (Last In, First Out). The last element "
                    + "inserted is the first one removed.";
        }

        // Queue
        if (question.matches(".*\\bqueue\\b.*")) {
            return "A Queue is a linear data structure that follows "
                    + "FIFO (First In, First Out). The first element "
                    + "inserted is the first one removed.";
        }

        // Algorithm
        if (question.contains("algorithm")) {
            return "An Algorithm is a finite sequence of clear, "
                    + "step-by-step instructions used to solve "
                    + "a particular problem.";
        }

        // OOP
        if (question.contains("oops")
                || question.contains("object oriented")
                || question.contains("oop")) {
            return "OOP stands for Object-Oriented Programming. "
                    + "Its four main principles are Encapsulation, "
                    + "Inheritance, Polymorphism and Abstraction.";
        }

        // Networking
        if (question.contains("computer network")
                || question.matches(".*\\bnetwork\\b.*")) {
            return "A Computer Network is a group of connected devices "
                    + "that communicate and share information. "
                    + "Examples include LAN, MAN and WAN.";
        }

        // Internet
        if (question.contains("internet")) {
            return "The Internet is a worldwide network of connected "
                    + "computers and devices that communicate "
                    + "using standard protocols.";
        }

        // Chatbot
        if (question.contains("chatbot")) {
            return "A Chatbot is a software application that "
                    + "communicates with users through text or voice. "
                    + "It can use predefined rules or AI models.";
        }

        // NLP
        if (question.matches(".*\\bnlp\\b.*")
                || question.contains("natural language processing")) {
            return "NLP stands for Natural Language Processing. "
                    + "It is a branch of AI that helps computers "
                    + "understand, process and generate human language.";
        }

        // No matching FAQ
        return null;
    }
}
