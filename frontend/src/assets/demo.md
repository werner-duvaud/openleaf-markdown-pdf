Title: Openleaf Editor
Description: Python based Markdown Editor for generating PDF
Author: Werner Duvaud
Date: \today

\no-header
# Table of content
[toc]

## Markdown to PDF
This demo file shows all the features available. Useful to test a theme.

## Titles

# Header 1

## Header 2

### Header 3
Normal text ...

## Bold
This word is in **bold**.

## Italic
This word is in *italic*.

## Link
This word is a [link to bold](#bold) to a title in the document.

## Lists

* Simple bullet list
* Simple bullet list

[ ] Unchecked list
[x] Checked list

The bullet style is customizable

## Quote

> "What is clearly thought out is clearly expressed"

## Code

This is a `peace of code` in a line

```python
This is a python code block with pygments coloring
print("Color")
This is a code block and it breaks the line automatically if it is veryyyyyy long.
```

## Image
<img style="height: 250px;" src="https://upload.wikimedia.org/wikipedia/commons/0/04/La_galerie_des_machines_%28%C3%AEle_de_Nantes%29_%287162972497%29.jpg"/>

## Table

|Header      |Header         |Header   |
|------------|---------------|---------|
|Content     |Content        |Content  |
|Content     |`Code content` |*Italic*  |
|Content     |Content        |Content  |

## Admonition block

!!! red "Red admonition block"
    Write everything here. `Here is some code`.


!!! green "Green admonition block"
    Write everything here. `Here is some code`.

!!! red ""
    Title is optional.

!!! whatever "You can add your own style"
    Here is your content.

## Math with KaTex

This math is inline $`a^2+b^2=c^2`$.

This is a math block:
```math
f(x) = \int_{-\infty}^\infty
\hat f(\xi)\,e^{2 \pi i \xi x}
\,d\xi
```

## Extras

Insert the date: \today

<center>Center elements</center>

Force a page break below:
\page-break
Here is a new page
\no-header
Here is a new page and we have also disabled the header