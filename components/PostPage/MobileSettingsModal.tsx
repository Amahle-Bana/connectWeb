import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col w-[300px] h-[80vh] bottom-[10%] rounded-lg p-2">
        <DialogHeader className="flex justify-center items-center h-[10%]">
          <DialogTitle className="font-playfair-display">Settings</DialogTitle>
        </DialogHeader>
        <div className=" h-[80%] flex flex-col gap-6 overflow-y-auto">

            
          {/* Audience Section */}
          <div>
            <h3 className="font-semibold mb-2 text-sm font-playfair-display">Audience</h3>
            <div className="flex flex-col gap-2">

              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="audience" value="everybody" defaultChecked className="peer hidden" />
                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-2 h-2 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded-3xl transition-colors text-sm font-playfair-display">Everybody</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="audience" value="subscribers" className="peer hidden" />
                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-2 h-2 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded-3xl transition-colors text-sm font-playfair-display">Subscribers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="audience" value="paid-subscribers" className="peer hidden" />
                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-2 h-2 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded-3xl transition-colors text-sm font-playfair-display">Paying Subscribers</span>
              </label>

            </div>
          </div>

          {/* Allow Comments From Section */}
          <div>
            <h3 className="font-semibold text-sm font-playfair-display">Allow Comments From</h3>
            <div className="flex flex-col gap-2">

              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="commentsFrom" value="everybody" defaultChecked className="peer hidden" />
                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-2 h-2 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded transition-colors font-playfair-display">Everybody</span>
              </label>


              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="commentsFrom" value="subscribers" className="peer hidden" />
                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-2 h-2 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded transition-colors font-playfair-display">Subscribers</span>
              </label>


              <label className="flex items-center gap-2 cursor-pointer px-2">
                <input type="radio" name="commentsFrom" value="paid-subscribers" className="peer hidden" />
                <span className="w-4 h-4 flex items-center justify-center rounded-full border border-gray-300 bg-gray-200 peer-checked:bg-secondary peer-checked:border-secondary transition-colors">
                  <span className="w-2 h-2 rounded-full bg-white peer-checked:bg-white" />
                </span>
                <span className="px-3 py-1 rounded transition-colors font-playfair-display">Paying Subscribers</span>
              </label>
            </div>
          </div>

          {/* Send Test Email Section */}
          <div>
            <h3 className="font-semibold mb-2 text-sm font-playfair-display">Send Test Email</h3>
            <div className="flex gap-2 flex-col font-playfair-display">
              <Input type="email" placeholder="Enter email" className="flex-1 border rounded-md px-5 py-1 " />
              <Button variant="secondary">Send</Button>
            </div>
          </div>

          {/* Send A Secret Draft Section */}
          <div>
            <h3 className="font-semibold mb-2 text-sm font-playfair-display">Send A Secret Draft</h3>
            <div className="flex gap-2 flex-col font-playfair-display">
              <Input type="email" placeholder="Enter email" className="flex-1 border rounded-md px-2 py-1" />
              <Button variant="secondary">Send</Button>
            </div>
          </div>

          {/* SEO Inputs Section */}
          <div className="pb-10 font-playfair-display">
            <h3 className="font-semibold mb-2 text-sm">SEO Inputs</h3>
            <div className="flex flex-col gap-2">
              <Input type="text" placeholder="SEO Title" className="border rounded-md px-2 py-1" />
              <Input type="text" placeholder="SEO Description" className="border rounded-md px-2 py-1" />
              <Input type="text" placeholder="SEO Keywords (comma separated)" className="border rounded-md px-2 py-1" />
            </div>
          </div>
        </div>
        <DialogFooter className="h-[10%] font-playfair-display">
          <Button onClick={() => onOpenChange(false)} className="bg-background text-primary border border-gray-300 hover:bg-gray-100">
            Close
          </Button>
          <Button variant="secondary" className="mb-2">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal; 