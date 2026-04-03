import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';



const SubSectionModal = ({modalData, setModalData, add=false, view=false , edit=false}) => {


  const {
    handleSubmit,
    register,
    setValue,
    formState: {errors},
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
   const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)

  useEffect(()=>{
    if(view || edit){
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  const isformUpdated =()=>{
    const currentValues = getValues()
    if(currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues .lectureVideo !== modalData.VideoUrl){
        return true;
      }else{
        return false;
      }
  }

  const handleEditSubSection= async()=>{

    const currentValues= getValues();
    const formData = FormData()
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);

    if(currentValues.lectureTitle !== modalData.title )[
      formData.append("title", currentValues.lectureTitle)
    ]
    if(currentValues.lectureDesc !== modalData.description )[
      formData.append("description", currentValues.lectureDesc)
    ]
    if(currentValues.lectureVideo !== modalData.videoUrl ){
      formData.append("video", currentValues.lectureVideo)
    }

    setLoading(true)
    const result = await updateSubSection(formData, token);

    if(result){
      // 
      dispatch(setCourse(result))
    }
    setModalData(null)
    setLoading(false)

  }

  const onSubmit =async (data)=>{
    if(view){
      return;
    }
    if(edit){
      if(!isformUpdated){
        toast.error("No Changes Made")
      }else{
        handleEditSubSection();
      }
      return;     
    }

    const formData = new FormData()
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo)
    setLoading(true);


    const result = await createSubSection(formData, token);

    if (result){
      // 
      dispatch(setCourse(result))

    }
    setModalData(null)
    setLoading(false)
  }

  return (
    <div>
      <div className="">
        <p className=""> {view && "Viewing"} {edit && "Editing"} {add && "Adding"} Lecture</p>
      </div>
      
    </div>
  )
}

export default SubSectionModal
