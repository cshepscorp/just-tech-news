async function upvoteClickHandler(event) {
    event.preventDefault();

    // console.log('button clicked');

    // to get post_id from ex: http://localhost:3001/post/1
    // split it into an array based on the / character, and then grab the last item in the array
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

    // console.log(id);
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: { 'Content-Type': 'application/json' }
    });
    // check the response status
    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);