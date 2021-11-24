async function editFormHandler(event) {
    event.preventDefault();
    // When the button is clicked, capture the id of the post
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
      const title = document.querySelector('input[name="post-title"]').value;

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title
          }),
          headers: {
            'Content-Type': 'application/json'
          }
      });
      // check the response status
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }

  }
  
  document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);
  



