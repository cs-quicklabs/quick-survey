class Screening::HrController < ApplicationController
  def index
    authorize [:screening, :hr]
    file = File.read("./json/hr.json")
    @data = JSON.parse(file, object_class: Job)
  end
end
