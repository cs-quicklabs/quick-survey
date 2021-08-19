class HomeController < ApplicationController
  def index
    @title = "Home"
    @surveys = Survey::Survey.all
  end
end
