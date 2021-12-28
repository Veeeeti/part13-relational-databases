const dummy = (blogs) => {
    return 1
}

totalLikes = (blogs) => {
    const sum = (blogs.map((blog,b) => blog.likes + b))
    return Number(sum)
}

favouriteBlog = (blogs) => {
    blogs.sort((a,b) => b.likes - a.likes)
    return blogs[0]
}

/* 4.6 ... EI TOIMI, tee GROUPBY funktio
mostBlogs = (blogs) => {
    const authors = []
    blogs.map(blog => {
        authors.concat(blog.author)
    })
    authors.forEach((a,b) => {
        if (a.author === b.author) {
            count++
        }
    })
    console.log(authors)
    return authors
}
*/


module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}
