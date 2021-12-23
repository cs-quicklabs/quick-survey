class Screening::VendorController < ApplicationController
  def index
    file = File.read("./json/vendor.json")
    @data = JSON.parse(file, object_class: Job)
  end
end
