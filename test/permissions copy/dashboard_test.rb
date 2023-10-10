require "application_system_test_case"
require "nokogiri"

class DashboardTest < ApplicationSystemTestCase
  include ActionMailer::TestHelper

  setup do
    @account = accounts(:crownstack)
    ActsAsTenant.current_tenant = @account
  end

  def page_url
    dashboard_url(script_name: "/#{@account}")
  end

  test " admin can all pages in dashboard" do
    @admin = users(:admin)
    sign_in @admin
    within "nav.navbar" do
      assert_selector "a", text: "Dashboard"
      assert_selector "a", text: "Board"
      assert_selector "a", text: "Spaces
      assert
    end
  end
end
