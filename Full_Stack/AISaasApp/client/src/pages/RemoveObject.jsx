import React, { useState } from "react";
import { Scissors, Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

// configure backend url from .env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  // getToken function from clerk
  const { getToken } = useAuth();

  // function to handle api call to generate image/s
  const onSubmitHandler = async (e) => {
    // prevent default browser's behavior: page reload
    e.preventDefault();
    try {
      setLoading(true);
      // check if single object is provided to remove
      if (object.split(" ").length > 1) {
        return toast("Please Enter Only One Object Name!");
      }
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      // make the api call to generate article
      // we write only the remaining path because we have configured in the start the baseUrl of the backend in axios.defaults.baseUrl
      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      // check the response status
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }

    // stop loading after getting the success data
    setLoading(false);
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          required
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
        />
        <p className="mt-6 text-sm font-medium">
          Describe Object Name To Remove
        </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          required
          rows={4}
          placeholder="e.g., watch or spoon, Only single word object name."
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
        ></textarea>
        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>
      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9" />
              <p>Upload an image and click "Remove Object" to get started.</p>
            </div>
          </div>
        ) : (
          <img src={content} className="mt-3 w-full h-full" />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
