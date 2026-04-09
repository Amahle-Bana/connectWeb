import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col w-[600px] h-[80vh] bottom-[10%]">
        <DialogHeader className="flex justify-center items-center h-[10%]">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 h-[80%] flex flex-col gap-6 overflow-y-auto">

            
          {/* Audience Section */}
          <div>
            <h3 className="font-semibold mb-2">Audience</h3>
            <div className="flex flex-col gap-4">

              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="audience" value="everybody" defaultChecked className="peer hidden" />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-3 h-3 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded-3xl transition-colors">Everybody</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="audience" value="subscribers" className="peer hidden" />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-3 h-3 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded-3xl transition-colors">Subscribers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="audience" value="paid-subscribers" className="peer hidden" />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-3 h-3 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded-3xl transition-colors">Paying Subscribers</span>
              </label>

            </div>
          </div>

          {/* Allow Comments From Section */}
          <div>
            <h3 className="font-semibold mb-2">Allow Comments From</h3>
            <div className="flex flex-col gap-4">

              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="commentsFrom" value="everybody" defaultChecked className="peer hidden" />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-3 h-3 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded transition-colors">Everybody</span>
              </label>


              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="commentsFrom" value="subscribers" className="peer hidden" />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-3 h-3 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded transition-colors">Subscribers</span>
              </label>


              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="commentsFrom" value="paid-subscribers" className="peer hidden" />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-3 h-3 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded transition-colors">Paying Subscribers</span>
              </label>
            </div>
          </div>

          {/* Send Test Email Section */}
          <div>
            <h3 className="font-semibold mb-2">Send Test Email</h3>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter email" className="flex-1 border rounded-md px-5 py-1" />
              <Button variant="secondary">Send</Button>
            </div>
          </div>

          {/* Send A Secret Draft Section */}
          <div>
            <h3 className="font-semibold mb-2">Send A Secret Draft</h3>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter email" className="flex-1 border rounded-md px-2 py-1" />
              <Button variant="secondary">Send</Button>
            </div>
          </div>

          {/* SEO Inputs Section */}
          <div>
            <h3 className="font-semibold mb-2">SEO Inputs</h3>
            <div className="flex flex-col gap-2">
              <input type="text" placeholder="SEO Title" className="border rounded-md px-2 py-1" />
              <input type="text" placeholder="SEO Description" className="border rounded-md px-2 py-1" />
              <input type="text" placeholder="SEO Keywords (comma separated)" className="border rounded-md px-2 py-1" />
            </div>
          </div>
        </div>
        <DialogFooter className="h-[10%]">
          <Button onClick={() => onOpenChange(false)} className="bg-background text-primary border border-gray-300 hover:bg-gray-100">
            Close
          </Button>
          <Button variant="secondary">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal; 