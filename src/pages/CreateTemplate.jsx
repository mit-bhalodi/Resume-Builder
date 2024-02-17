import React, { useEffect, useState } from "react"
import { FaTrash, FaUpload } from "react-icons/fa6"
import { HashLoader } from "react-spinners"
import { toast } from "react-toastify"
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage, db } from "../config/firebase.config"
import { adminIds, initialTags } from "../utils/Helpers"
import { doc, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore"
import useTemplates from "../hooks/useTemplates"
import useUser from "../hooks/useUser"
import { useNavigate } from "react-router-dom"

const CreateTemplate = () => {
    const [formData, setFormData] = useState({
        title: "",
        imageUrl: null,
    })

    const [imageAsset, setImageAsset] = useState({
        isImageLoading: false,
        url: null,
        process: 0
    })

    const [selectedTags, setSelectedTags] = useState({})

    const { data: templates, isError: templatesError, isLoading: templatesLoading, refetch: templatesRefetch } = useTemplates();

    const { data: user, isLoading: userLoading } = useUser()

    const handleInputFieldChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleTagSelect = (tagname) => {
        if (selectedTags[tagname]) {
            setSelectedTags((prev) => ({ ...prev, [tagname]: false }))
        } else {
            setSelectedTags((prev) => ({ ...prev, [tagname]: true }))
        }
    }

    const pushToCloud = async () => {
        const timeStamp = serverTimestamp();
        const id = `${Date.now()}`
        const _doc = {
            _id: id,
            title: formData.title,
            imageUrl: imageAsset.url,
            tags: Object.keys(selectedTags).filter((tag) => selectedTags[tag]),
            name: `Template${(templates?.length || 0) + 1}`,
            timeStamp: timeStamp,
        }

        await setDoc(doc(db, "templates", id), _doc).then(() => {
            setFormData((prev) => ({ ...prev, title: "", imageUrl: null }));
            setImageAsset((prev) => ({ ...prev, url: null }));
            setSelectedTags({})
            templatesRefetch()
            toast.success("Template created successfully")
        }).catch((err) => toast.error(err.message || "Something went wrong"))
    }

    const removeTemplate = async (template) => {
        const templateImageRef = ref(storage, template.imageUrl)
        const templateId = template._id
        const templateRef = doc(db, "templates", templateId);
        await deleteObject(templateImageRef).then(async () => {
            await deleteDoc(templateRef).then(() => {
                toast.success("Template deleted successfully")
                templatesRefetch()
            }).catch((err) => toast.error(err.message || "Something went wrong"))
        }).catch((err) => toast.error(err.message || "Something went wrong"))
    }

    const handleFileSelect = async (e) => {
        setImageAsset((prev) => ({ ...prev, isImageLoading: true }));
        const file = e.target.files[0]
        if (file && isAllowedFileType(file)) {
            const storageRef = ref(storage, `templates/${Date.now()}-${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", (snapshot) => {
                setImageAsset((prev) => ({ ...prev, process: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 }));
            }, (error) => toast.error(error.message || "Something went wrong"), () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setImageAsset((prev) => ({ ...prev, url: url, isImageLoading: false }));
                })
                toast.success("File uploaded successfully")
            })
        } else {
            toast.info("Invalid file format")
        }
    }

    const deleteImageObject = async () => {
        const deleteRef = ref(storage, imageAsset.url);
        deleteObject(deleteRef).then(() => {
            toast.success("File deleted successfully")
            setImageAsset((prev) => ({ ...prev, url: null, process: 0 }));
        }, (error) => toast.error(error.message || "Something went wrong"))
    }

    const isAllowedFileType = (file) => {
        const allowedType = ["image/png", "image/jpeg", "image/jpg"];
        return allowedType.includes(file.type) ? true : false
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && !adminIds.includes(user.uid)) {
            navigate("/", { replace: true })
        }
    }, [user, userLoading, navigate])

    return (
        <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
            {/* Left container */}
            <div className="col-span-12 lg:col-span-4 2xl:col-span-3 flex-1 flex items-center justify-start flex-col gap-4 px-2">
                <div className="w-full">
                    <p className="txt-lg text-txtPrimary">Create new template</p>
                </div>

                {/* Template id section */}
                <div className="w-full flex items-center">
                    <p className="text-base text-txtLight uppercase font-semibold">TempId: &nbsp;</p>
                    <p className="text-sm text-txtDark capitalize font-bold">{`Template${(templates?.length || 0) + 1}`}</p>
                </div>

                {/* Template title section */}
                <input type="text" placeholder="Template title" value={formData.title} onChange={handleInputFieldChange} name="title" className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"></input>

                {/* File uploader */}
                <div className="w-full bg-gray-100 backdrop-blur-md h-[380px] lg:h-[580px] 2xl:h-[600px] rounded-md border-2 border-dotted border-gray-200 flex items-center justify-center">
                    {
                        imageAsset?.isImageLoading ?
                            <React.Fragment>
                                <div className="flex flex-col items-center justify-center">
                                    <HashLoader size={40} color="#498fcd"></HashLoader>
                                    <p className="py-3">{imageAsset?.process?.toFixed(2)}%</p>
                                </div>
                            </React.Fragment> :

                            <React.Fragment>
                                {
                                    !imageAsset?.url ?
                                        <React.Fragment>
                                            <label className="w-full cursor-pointer h-full">
                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                    <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                                                        <FaUpload className="text-2xl" />
                                                        <p className="text-lg text-txtLight">Click to upload</p>
                                                    </div>
                                                </div>
                                                <input type="file" className="w-0 h-0" accept=".jpeg, .jpg, .png" onChange={handleFileSelect}></input>
                                            </label>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <div className="relative w-full h-full overflow-hidden rounded-md">
                                                <img src={imageAsset?.url} alt="Template" className="w-full h-full object-cover" loading="lazy" />
                                                {/* Delete button */}
                                                <div className="absolute top-4 right-4  w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer" onClick={deleteImageObject}><FaTrash className="text-sm text-white" /></div>
                                            </div>
                                        </React.Fragment>
                                }
                            </React.Fragment>
                    }
                </div>

                {/* Tags */}
                <div className="w-full flex items-center flex-wrap gap-2">
                    {initialTags.map((tag, index) => (
                        <div key={index} onClick={() => handleTagSelect(tag)} className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${selectedTags[tag] ? "bg-blue-500 text-white" : ""}`}>
                            <p className="text-sm">{tag}</p>
                        </div>
                    ))}
                </div>

                {/* Button action */}
                <button type="button" className="w-full bg-blue-700 text-white rounded-md py-2" onClick={pushToCloud}>Save</button>
            </div>

            {/* Right container */}
            <div className="col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
                {templatesLoading ? (<React.Fragment>
                    <div className="w-full h-full flex justify-center items-center"><HashLoader size={40} color="#498fcd" /></div>
                </React.Fragment>) : (<React.Fragment>
                    {
                        templates && templates?.length > 0 ?
                            (<React.Fragment>
                                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4" >
                                    {templates.map((template) =>
                                    (
                                        <div className="w-full h-[520px] rounded-md overflow-hidden relative" key={template._id}>
                                            <img src={template.imageUrl} alt="Template" className="w-full h-full object-cover" loading="lazy" />
                                            <div className="absolute top-4 right-4  w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer" onClick={() => removeTemplate(template)}><FaTrash className="text-sm text-white" /></div>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>) :
                            (<React.Fragment>
                                <div className="h-full w-full flex items-center justify-center">
                                    <HashLoader size={40} color="#498fcd" />
                                </div>
                            </React.Fragment>)
                    }
                </React.Fragment>)}
            </div>
        </div>
    )
}

export default CreateTemplate
