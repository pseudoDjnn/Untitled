const newPost = document.querySelector("#new-post-form");

const cloudinary_url = `https://res.cloudinary.com/dpzhkh1il/images/`;
const cloud_upload_preset = "olyqsw50";

const image = document.getElementById("image");

image.addEventListener("change", function (event) {
  console.log(image.value);
  const file = event.target.files[0];
  console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  // formData.append("upload_preset", cloud_upload_preset);

  axios({
    url: cloudinary_url,
    method: "POST",
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded",
    // },
    data: formData,
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
});

async function addPostHandler(event) {
  event.preventDefault();
  console.log(addPostHandler);
  const title = document.querySelector("#title").value;
  const content = document.querySelector("#content").value;
  const image = document.querySelector("#image");
  console.log(image.value);
  // const uploaded_image = "";

  const user_id = newPost.getAttribute("user-data");

  if (title && content && image) {
    const data = new FormData();
    console.log(data);

    if (image.files && image.files.length) {
      data.append("image", image.files[0]);
    }

    data.append("title", title);
    data.append("content", content);
    data.append("image", image);
    data.append("user_id", user_id);

    const response = await fetch("/api/posts", {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  } else {
    alert("Please fill out all fields!");
  }
}

newPost.addEventListener("submit", addPostHandler);
// imageUpload.addEventListener("change", function);
