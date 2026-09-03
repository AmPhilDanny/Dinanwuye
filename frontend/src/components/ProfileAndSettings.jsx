import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldStar, Moon, Camera, Check, X, MapPin, PencilSimple } from '@phosphor-icons/react';
import { IonToast, IonSpinner } from '@ionic/react';
import { profileApi } from '@services/api';
import { photoUrl } from '@utils/photoUrl';

const VALUE_OPTIONS = ["Family", "Ambition", "Faith", "Creativity", "Growth", "Community", "Freedom", "Service"];
const INTENTIONS = ["Marriage / Life Partner", "Serious Dating", "Meaningful Connection"];

function getInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function ProfileAndSettings({ user, onChange, onPhotoUploaded, toast, onToastDismiss }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [editIntention, setEditIntention] = useState(user.intention || '');
  const [editValues, setEditValues] = useState(user.values || []);
  const [uploading, setUploading] = useState(false);
  const [photoToast, setPhotoToast] = useState({ open: false, message: '', color: 'success' });
  const fileInputRef = useRef(null);

  const toggleValue = (v) => {
    if (!editing) return;
    setEditValues((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const toggleIncognito = () => {
    if (onChange) onChange({ ...user, incognito: !user.incognito });
  };

  const save = () => {
    if (onChange) onChange({ ...user, name, bio, intention: editIntention, values: editValues });
    setEditing(false);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoToast({ open: true, message: 'Please select an image file', color: 'danger' });
      return;
    }

    setUploading(true);
    try {
      await profileApi.addPhoto(file);
      if (onPhotoUploaded) {
        await onPhotoUploaded();
      }
      setPhotoToast({ open: true, message: 'Photo updated', color: 'success' });
    } catch {
      setPhotoToast({ open: true, message: 'Failed to upload photo', color: 'danger' });
    } finally {
      setUploading(false);
    }
    event.target.value = '';
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const resolvedPhoto = photoUrl(user.photo);
  const hasPhoto = !!resolvedPhoto;

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-foreground">Your Profile</h2>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Edit how you show up to intentional matches</p>
        </div>
        <button
          onClick={() => (editing ? save() : setEditing(true))}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/25 transition active:scale-95"
        >
          {editing ? <Check size={14} weight="bold" /> : <PencilSimple size={14} weight="bold" />}
          {editing ? "Save" : "Edit"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 overflow-hidden rounded-3xl bg-foreground/5 shadow-sm"
      >
        <div className="relative h-44">
          {hasPhoto ? (
            <img src={resolvedPhoto} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary">
              <span className="text-5xl font-extrabold text-white/90 select-none">{getInitials(user.name)}</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-white/20 px-2 py-1 text-lg font-extrabold text-white outline-none backdrop-blur focus:bg-white/30"
              />
            ) : (
              <h3 className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">{user.name}, {user.age}</h3>
            )}
            <p className="flex items-center gap-1 text-sm text-white/90 drop-shadow-sm">
              <MapPin size={13} weight="fill" />{user.city || user.location}, {user.country || 'Nigeria'} · {user.job || 'Professional'}
            </p>
          </div>

          <button
            onClick={triggerPhotoUpload}
            disabled={uploading}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition active:scale-90"
            aria-label="Change photo"
          >
            {uploading ? <IonSpinner name="crescent" color="light" /> : <Camera size={16} weight="bold" />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-1.5 text-sm font-bold text-sky-600 dark:text-sky-400">
            <ShieldCheck size={16} weight="fill" /> ID Verified
          </span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldStar size={14} weight="fill" /> Trust {user.trustScore || 100}
          </span>
        </div>

        <div className="px-4 pb-4">
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-background p-3 text-sm text-foreground outline-none focus:border-primary dark:border-gray-600"
              rows={3}
            />
          ) : (
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{user.bio || 'Add a bio to let matches know more about you.'}</p>
          )}
        </div>
      </motion.div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-gray-200 bg-background p-4 dark:border-gray-700">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">Intention</p>
          <motion.div layout className="flex flex-col gap-1">
            {INTENTIONS.map((int) => {
              const isSelected = editing ? editIntention === int : user.intention === int;
              return (
                <button
                  key={int}
                  onClick={() => editing && setEditIntention(int)}
                  disabled={!editing}
                  className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition active:scale-95 ${
                    isSelected
                      ? "bg-primary text-white shadow-sm"
                      : editing
                      ? "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      : "text-gray-700 dark:text-gray-300 opacity-80"
                  } ${!editing ? 'cursor-default' : ''}`}
                >
                  {int}
                  {isSelected && <Check size={12} weight="bold" />}
                </button>
              );
            })}
          </motion.div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-background p-4 dark:border-gray-700">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">Cultural values</p>
          <div className="flex flex-wrap gap-1.5">
            {VALUE_OPTIONS.map((v) => {
              const has = editing ? editValues.includes(v) : (user.values || []).includes(v);
              return (
                <button
                  key={v}
                  onClick={() => toggleValue(v)}
                  disabled={!editing}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition active:scale-95 ${
                    has ? "bg-secondary text-white shadow-sm" : "border border-gray-200 bg-background text-gray-700 hover:border-secondary/40 dark:border-gray-600 dark:text-gray-300"
                  } ${!editing ? 'cursor-default opacity-80' : ''}`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-gray-200 bg-background p-4 dark:border-gray-700">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Moon size={16} weight="fill" className="text-violet-500" /> Incognito mode
            </p>
            <p className="text-[11px] font-medium text-gray-600 dark:text-gray-300">Hide your profile from people you pass</p>
          </div>
          <button
            onClick={toggleIncognito}
            aria-label="Toggle incognito"
            className={`relative h-7 w-12 rounded-full transition ${user.incognito ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${user.incognito ? "right-1" : "left-1"}`}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck size={18} weight="fill" />
          <p className="text-xs font-semibold">You&apos;ve pledged the community safety guidelines. Report anything that feels off, we take it seriously.</p>
        </div>
      </div>

      <IonToast
        isOpen={toast?.open || false}
        onDidDismiss={onToastDismiss}
        message={toast?.message || ''}
        duration={2500}
        position="bottom"
        color={toast?.color || 'success'}
      />
      <IonToast
        isOpen={photoToast.open}
        onDidDismiss={() => setPhotoToast({ ...photoToast, open: false })}
        message={photoToast.message}
        duration={2500}
        position="bottom"
        color={photoToast.color}
      />
    </div>
  );
}
