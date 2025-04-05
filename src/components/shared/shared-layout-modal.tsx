"use client";

import { motion } from "framer-motion";
import Modal from "./modal";

interface SharedLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharedLayoutModal({
  isOpen,
  onClose,
}: SharedLayoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Shared Layout
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            This is a shared layout modal with smooth animations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * item }}
              className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Item {item}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Description for item {item}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Confirm
          </button>
        </motion.div>
      </div>
    </Modal>
  );
}
