import React, { useState, useRef, useEffect, useContext } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { AuthContext } from "../context/AuthContext";
import {
  FiX, FiUser, FiEdit3, FiSave, FiShield, FiBook,
  FiCode, FiCamera, FiUpload, FiLock, FiCrop
} from "react-icons/fi";

const CropImage = ({ imageUrl, imageProps, setImageProps }) => {
  const [image] = useImage(imageUrl, "anonymous");
  const imageRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    if (!image) return;
    const stageWidth = 300, stageHeight = 300;
    const imgWidth = image.width, imgHeight = image.height;
    const scale = Math.max(220 / imgWidth, 220 / imgHeight);
    const newWidth = imgWidth * scale;
    const newHeight = imgHeight * scale;

    setImageProps(prev => ({
      ...prev,
      x: (stageWidth - newWidth) / 2,
      y: (stageHeight - newHeight) / 2,
      width: newWidth,
      height: newHeight,
      isSelected: true,
    }));
  }, [image, setImageProps]);

  useEffect(() => {
    if (imageProps.isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [imageProps.isSelected]);

  return (
    <>
      <KonvaImage
        image={image}
        ref={imageRef}
        {...imageProps}
        draggable
        onClick={() => setImageProps(prev => ({ ...prev, isSelected: true }))}
        onTap={() => setImageProps(prev => ({ ...prev, isSelected: true }))}
        onDragEnd={e => setImageProps(prev => ({ ...prev, x: e.target.x(), y: e.target.y() }))}
        onTransformEnd={() => {
          const node = imageRef.current;
          if (!node) return;
          const scaleX = node.scaleX(), scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          setImageProps(prev => ({
            ...prev,
            x: node.x(),
            y: node.y(),
            width: Math.max(60, node.width() * scaleX),
            height: Math.max(60, node.height() * scaleY),
          }));
        }}
      />
      {imageProps.isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={true}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 60 || newBox.height < 60 ? oldBox : newBox)}
        />
      )}
    </>
  );
};

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile, updateAvatar, changePassword } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({ name: user?.name || "" });
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState("");
  const [konvaImageProps, setKonvaImageProps] = useState({ x: 0, y: 0, width: 220, height: 220, isSelected: true });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const stageRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setFormData({ name: user.name || "" });
    setSelectedAvatarFile(null);
    setPreviewAvatar("");
  }, [user]);

  if (!isOpen || !user) return null;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChangeInput = e => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFeedback({ type: "error", message: "Image size should be less than 2MB." });
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedback({ type: "error", message: "Please select a valid image file." });
      e.target.value = "";
      return;
    }

    setFeedback({ type: "", message: "" });
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageSrc(reader.result);
      setKonvaImageProps({ x: 0, y: 0, width: 220, height: 220, isSelected: true });
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const dataURLToFile = (dataURL, fileName = "avatar.png") => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const byteString = atob(arr[1]);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    return new File([byteArray], fileName, { type: mime });
  };

  const handleApplyCrop = () => {
    if (!stageRef.current) return;
    setKonvaImageProps(prev => ({ ...prev, isSelected: false }));

    setTimeout(() => {
      const cropSize = 220;
      const cropX = (300 - cropSize) / 2;
      const cropY = (300 - cropSize) / 2;

      // Removed pixelRatio: 2 and used quality / lower export sizes if needed, 
      // or export as JPEG with compression quality (e.g., 0.85)
      const dataURL = stageRef.current.toDataURL({
        x: cropX,
        y: cropY,
        width: cropSize,
        height: cropSize,
        mimeType: "image/jpeg", // JPEG compresses much better than PNG
        quality: 0.85            // Adjust quality from 0 to 1
      });

      setPreviewAvatar(dataURL);
      const croppedFile = dataURLToFile(dataURL, `avatar-${Date.now()}.jpg`);
      setSelectedAvatarFile(croppedFile);
      setShowCropModal(false);
    }, 50);
  };

  const handleSaveChanges = async e => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      const trimmedName = formData.name.trim();
      if (!trimmedName) throw new Error("Name is required.");

      if (trimmedName !== user.name) {
        const response = await updateProfile({ name: trimmedName });
        if (!response?.success) throw new Error(response?.message || "Failed to update profile.");
      }

      if (selectedAvatarFile) {
        // Create a new FormData instance
        const data = new FormData();

        // IMPORTANT: Change 'avatar' to whatever string your backend Multer setup expects 
        // e.g., upload.single('avatar') means it should be 'avatar'
        data.append("avatar", selectedAvatarFile);

        const response = await updateAvatar(data);
        if (!response?.success) throw new Error(response?.message || "Failed to update avatar.");
      }

      setIsEditing(false);
      setSelectedAvatarFile(null);
      setPreviewAvatar("");
      setFeedback({ type: "success", message: "Profile updated successfully." });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setFeedback({ type: "error", message: "New password must be at least 6 characters long." });
      return;
    }

    setIsSaving(true);

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (!response?.success) throw new Error(response?.message || "Failed to change password.");

      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setFeedback({ type: "success", message: "Password changed successfully." });
    } catch (error) {
      setFeedback({ type: "error", message: error?.message || "Failed to change password. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ name: user.name || "" });
    setSelectedAvatarFile(null);
    setPreviewAvatar("");
    setFeedback({ type: "", message: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentAvatar = (typeof user?.avatar === "string" && user.avatar.trim() !== "") 
  ? user.avatar 
  : (user?.avatar?.url && typeof user.avatar.url === "string" && user.avatar.url.trim() !== "") 
    ? user.avatar.url 
    : null;

  const stats = user.stats || { totalSubjects: 0, totalLabPrograms: 0, totalScreenshots: 0 };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">User Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {feedback.message && (
            <div className={`p-3 rounded-lg text-xs border ${feedback.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"}`}>
              {feedback.message}
            </div>
          )}

          {/* Profile Header */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-md overflow-hidden relative">
                {currentAvatar ? (
                  <img src={currentAvatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name ? user.name.charAt(0) : "U"}</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (isEditing) {
                  handleCancelEdit();
                } else {
                  setIsEditing(true);
                  setFormData({ name: user.name || "" });
                  setPreviewAvatar("");
                  setSelectedAvatarFile(null);
                  setFeedback({ type: "", message: "" });
                }
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <FiEdit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <FiBook className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalSubjects}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Subjects</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <FiCode className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalLabPrograms}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Lab Programs</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <FiCamera className="w-5 h-5 mx-auto mb-1 text-amber-500" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalScreenshots}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Output</div>
            </div>
          </div>

          {/* Edit Profile Form / Details */}
          {isEditing ? (
            <form onSubmit={handleSaveChanges} className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Edit Personal Details</h4>
              <div className="flex items-center space-x-4 py-2">
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold overflow-hidden border border-slate-300 dark:border-slate-700">
                  {previewAvatar || currentAvatar ? (
                    <img src={previewAvatar || currentAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>{formData.name ? formData.name.charAt(0) : "U"}</span>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <FiUpload className="w-3.5 h-3.5" />
                    <span>Change Avatar</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageChange} className="hidden" />
                  <span className="block text-[10px] text-slate-400 mt-1">JPG, PNG, GIF or WEBP (Max 5MB)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={handleCancelEdit} disabled={isSaving} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="flex items-center space-x-1 px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer">
                  <FiSave className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Account Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">Full Name</span>
                  <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">Email Address</span>
                  <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                <FiShield className="w-4 h-4 text-indigo-500" />
                <span>Security & Password</span>
              </h4>
              {!isChangingPassword && (
                <button onClick={() => setIsChangingPassword(true)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Current Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChangeInput}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChangeInput}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChangeInput}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    disabled={isSaving}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="cursor-pointer flex items-center space-x-1 px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                    <FiSave className="w-3.5 h-3.5" />
                    <span>{isSaving ? "Updating..." : "Update Password"}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Ensure your account is using a long, random password to stay secure.
              </div>
            )}
          </div>
        </div>

        {/* Cropper Modal */}
        {showCropModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl flex flex-col items-center">
              <div className="flex justify-between items-center w-full border-b pb-2 border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <FiCrop className="text-indigo-500" />
                  Adjust Avatar
                </h3>
                <button onClick={() => setShowCropModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-950">
                <Stage width={300} height={300} ref={stageRef}>
                  <Layer>
                    <CropImage imageUrl={rawImageSrc} imageProps={konvaImageProps} setImageProps={setKonvaImageProps} />
                  </Layer>
                </Stage>
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[220px] h-[220px] rounded-full border-2 border-dashed border-indigo-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Drag to reposition or resize the handles inside the circle. Aspect ratio is preserved.
              </p>

              <div className="flex justify-end gap-2 w-full pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropModal(false);
                    setRawImageSrc("");
                  }}
                  className="px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="button" onClick={handleApplyCrop} className="px-4 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer">
                  Crop & Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}