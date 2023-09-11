class Screening::VendorController < BaseController
  def index
    authorize [:screening, :vendor]
    file = File.read("./json/vendor.json")
    @data = JSON.parse(file, object_class: Job)
  end
end
