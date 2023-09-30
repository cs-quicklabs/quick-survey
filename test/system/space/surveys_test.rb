require "application_system_test_case"

class SurveysTest < ApplicationSystemTestCase
  setup do
    @user = users(:member)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    @space = @user.spaces.where(archive: false, user_id: @user.id).first
    @folder = @space.folders.where(user_id: @user.id).first
    @survey = @folder.survey_surveys.where(user_id: @user.id).first
    sign_in @user
  end

  def page_url
    space_folder_url(script_name: "/#{@account.id}", space_id: @space.id, id: @folder.id)
  end

  test "can show surveys if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: @folder.title
    assert_text "Add New Survey"
  end

  test "can show survey detail page from space details" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      click_on "Show"
    end
    within "#survey-header" do
      assert_selector "h1", text: @survey.name
      assert_text "Actions"
    end
    take_screenshot
  end

  test "can create a new survey in folder" do
    visit page_url
    click_on "Add New Survey"
    fill_in "survey_survey_name", with: "Survey Campaign"
    fill_in "survey_survey_description", with: "This is a sample Survey Description"
    select "Score", from: "survey_survey_survey_type"
    click_on "Add Survey"
    sleep(0.5)
    take_screenshot
    assert_text @folder.title
    assert_text "Survey Campaign"
  end

  test "can edit a survey from space details" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      click_on("Edit")
    end
    assert_selector "h1", text: "Edit Survey"
    fill_in "survey_survey_name", with: "Survey Campaigning"
    click_on "Edit Survey"
    assert_text "Survey Campaigning"
  end

  test "can pin a survey from space details" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      click_on "Pin Survey"
    end
    assert_text "Survey has been pinned."
  end

  test "can unpin a survey from space details" do
    pinned = survey_surveys(:four)
    visit page_url
    within "tr##{dom_id(pinned)}" do
      find("button", id: "survey-menu").click
      click_on "Unpin Survey"
    end
    assert_text "Survey has been unpinned."
  end

  test "can archive a survey from space details" do
    visit page_url
    survey = survey_surveys(:two)
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      page.accept_confirm do
        click_on "Archive"
      end
    end
    assert_text "Survey has been archived."
  end

  test "can change folder" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      find("p", id: "change-folder").click
    end

    select @space.title, from: "space_id"
    second_option_text = find("#folder_id").all("option")[1].text
    select second_option_text, from: "folder_id"
    click_on "Change"
    assert_text "Folder was changed successfully."
  end
end
